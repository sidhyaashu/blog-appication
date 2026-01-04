import express from 'express';
import { getPosts, getPostBySlug, getPostById, createPost, getFeaturedPosts, deletePost, updatePost, getComments, addComment } from '../controllers/postController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware for posts
const validatePostInput = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.get('/', getPosts);
router.get('/featured', getFeaturedPosts);
router.get('/id/:id', getPostById);

// Comments routes - must come before /:slug
router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, addComment);

// Slug route must be last among GET routes
router.get('/slug/:slug', getPostBySlug);

router.post(
    '/',
    protect,
    admin,
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('content').notEmpty().withMessage('Content is required'),
        body('slug').notEmpty().withMessage('Slug is required').isSlug().withMessage('Slug must be URL-friendly'),
        body('category_id').isMongoId().withMessage('Invalid category ID'),
        body('image').optional().isURL().withMessage('Image must be a valid URL'),
        body('status').isIn(['draft', 'published']).withMessage('Status must be draft or published'),
    ],
    validatePostInput,
    createPost
);

router.put(
    '/:id',
    protect,
    admin,
    [
        body('title').optional().notEmpty().withMessage('Title cannot be empty'),
        body('content').optional().notEmpty().withMessage('Content cannot be empty'),
        body('slug').optional().notEmpty().withMessage('Slug cannot be empty').isSlug().withMessage('Slug must be URL-friendly'),
        body('category_id').optional().isMongoId().withMessage('Invalid category ID'),
        body('image').optional().isURL().withMessage('Image must be a valid URL'),
        body('status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published'),
    ],
    validatePostInput,
    updatePost
);

router.delete('/:id', protect, admin, deletePost);

export default router;
