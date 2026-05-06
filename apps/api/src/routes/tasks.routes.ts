import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireLead, requireManager } from '../middleware/checkRole.middleware';

const router = Router();
const taskController = new TaskController();

// All task routes require authentication
router.use(authMiddleware);

// Any authenticated user: view tasks for a project they belong to
router.get('/project/:projectId', taskController.getTasksByProject);

// Any authenticated user: view their own tasks (filtered by role in controller)
router.get('/', taskController.getAllTasks);

// Any authenticated user: get dashboard stats (scoped by role in controller)
router.get('/stats', taskController.getTaskStats);

// Lead or above: create tasks (project membership enforced in controller)
router.post('/', requireLead, taskController.createTask);

// Worker or above: update task status/details (ownership enforced in controller)
router.put('/:id', taskController.updateTask);

// Manager or above: delete tasks
router.delete('/:id', requireManager, taskController.deleteTask);

export default router;
