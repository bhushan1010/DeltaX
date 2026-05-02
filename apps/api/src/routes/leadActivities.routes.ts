import { Router } from 'express';
import { LeadActivityController } from '../controllers/LeadActivityController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const activityController = new LeadActivityController();

// All routes require authentication
router.use(authMiddleware);

// Lead activity routes
router.get('/lead/:leadId/activities', activityController.getActivitiesByLeadId);
router.post('/activities', activityController.createActivity);
router.get('/activities/:id', activityController.getActivityById);
router.put('/activities/:id', activityController.updateActivity);
router.delete('/activities/:id', activityController.deleteActivity);
router.patch('/activities/:id/complete', activityController.completeActivity);

export default router;