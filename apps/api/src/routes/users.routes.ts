import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/checkRole.middleware';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authMiddleware);

// Get all users (admin only)
router.get('/', requireAdmin, userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user role (admin only)
router.put('/:id/role', requireAdmin, userController.updateUserRole);

// Deactivate/Activate user (admin only)
router.patch('/:id/status', requireAdmin, userController.toggleUserStatus);

export default router;