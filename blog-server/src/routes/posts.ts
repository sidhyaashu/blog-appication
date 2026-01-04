import express from 'express';
import { getPosts, getPostBySlug, getPostById, createPost, getFeaturedPosts, deletePost, updatePost, getComments, addComment, getRelatedPosts } from '../controllers/postController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware for posts
const validatePostInput = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.get('/', cacheMiddleware(300), getPosts); // Cache for 5 minutes
router.get('/featured', cacheMiddleware(300), getFeaturedPosts);
router.get('/id/:id', param('id').isMongoId(), validatePostInput, getPostById);

// Comments routes - must come before /:slug  
// Validate :id parameter is a valid MongoDB ObjectId
router.get('/:id/comments', param('id').isMongoId(), validatePostInput, getComments);
router.post('/:id/comments', protect, param('id').isMongoId(), validatePostInput, addComment);

// Slug route must be last among GET routes
router.get('/slug/:slug', cacheMiddleware(300), getPostBySlug);
router.get('/slug/:slug/related', cacheMiddleware(300), getRelatedPosts);

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
    param('id').isMongoId(),
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

router.delete('/:id', protect, admin, param('id').isMongoId(), validatePostInput, deletePost);

export default router;
