import { Router } from 'express';
import { LeadController } from '../controllers/LeadController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const leadController = new LeadController();

// All routes require authentication
router.use(authMiddleware);

// Lead routes
router.get('/', leadController.getLeads);
router.post('/', leadController.createLead);
router.get('/:id', leadController.getLeadById);
router.put('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);
router.post('/:id/assign', leadController.assignLead);
router.patch('/:id/status', leadController.updateLeadStatus);

export default router;