import type { Request, Response } from 'express';
import Post from '../models/Post.js';
import Category from '../models/Category.js';
import Comment from '../models/Comment.js';

export const getPosts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const skip = (page - 1) * limit;

        // Build search query
        const query: any = { status: 'published' };
        if (search) {
            // Use MongoDB text search for performance (requires text index)
            query.$text = { $search: search };
        }

        const posts = await Post.find(query)
            .populate('category_id', 'name slug')
            .populate('author_id', 'name email avatar_url')
            .sort({ published_at: -1 })
            .limit(limit)
            .skip(skip);

        const total = await Post.countDocuments(query);

        res.status(200).json({
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasMore: skip + posts.length < total
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getPostBySlug = async (req: Request, res: Response) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })
            .populate('category_id')
            .populate('author_id');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('category_id')
            .populate('author_id');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getFeaturedPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find({ featured: true })
            .populate('category_id')
            .populate('author_id')
            .limit(3);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        // req.user is populated by authMiddleware
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const newPost = new Post({
            ...req.body,
            author_id: user._id
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Optional: Check if user is author or admin (Assuming admin for now based on route protection)
        await post.deleteOne();

        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, slug, category_id, featured, status, image } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is author or admin
        const user = (req as any).user;
        if (!user || (post.author_id.toString() !== user._id.toString() && user.role !== 'admin')) {
            return res.status(401).json({ message: 'Not authorized to update this post' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.slug = slug || post.slug;
        post.category_id = category_id || post.category_id;
        post.featured = featured !== undefined ? featured : post.featured;
        post.status = status || post.status;
        post.image = image || post.image;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const getComments = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ post_id: req.params.id })
            .populate('user_id', 'name')
            .sort({ created_at: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const comment = await Comment.create({
            post_id: req.params.id,
            user_id: user._id,
            content
        });

        const populatedComment = await Comment.findById(comment._id).populate('user_id', 'name');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};