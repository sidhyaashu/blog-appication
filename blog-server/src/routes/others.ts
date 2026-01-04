import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { subscribe } from '../controllers/newsletterController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.get('/categories', getCategories);
router.post(
    '/categories',
    protect,
    admin,
    [
        body('name').notEmpty().withMessage('Category name is required'),
    ],
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    createCategory
);

router.put(
    '/categories/:id',
    protect,
    admin,
    [
        body('name').notEmpty().withMessage('Category name is required'),
    ],
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    updateCategory
);

router.delete('/categories/:id', protect, admin, deleteCategory);

router.post(
    '/newsletter',
    [
        body('email').isEmail().withMessage('Please include a valid email for newsletter subscription'),
    ],
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    subscribe
);

export default router;
