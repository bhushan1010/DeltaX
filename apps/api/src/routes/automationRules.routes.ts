import { Router } from 'express';
import { AutomationRuleController } from '../controllers/AutomationRuleController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const ruleController = new AutomationRuleController();

// All routes require authentication
router.use(authMiddleware);

// Automation rule routes
router.get('/', ruleController.getRules);
router.post('/', ruleController.createRule);
router.get('/:id', ruleController.getRuleById);
router.put('/:id', ruleController.updateRule);
router.delete('/:id', ruleController.deleteRule);
router.patch('/:id/toggle', ruleController.toggleRuleStatus);

export default router;