import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireManager, requireAdmin } from '../middleware/checkRole.middleware';

const router = Router();
const projectController = new ProjectController();

// All project routes require authentication
router.use(authMiddleware);

// Any authenticated user can list or view projects they belong to
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);

// Manager or above: create & update projects
router.post('/', requireManager, projectController.createProject);
router.put('/:id', requireManager, projectController.updateProject);

// Admin only: delete projects
router.delete('/:id', requireAdmin, projectController.deleteProject);

// Manager or above: add members to a project
router.post('/:id/members', requireManager, projectController.addMember);

// Admin only: remove a member from a project
router.delete('/:id/members/:userId', requireAdmin, projectController.removeMember);

export default router;
