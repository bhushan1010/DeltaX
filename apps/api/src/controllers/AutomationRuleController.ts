import { Request, Response } from 'express';
import { AutomationRuleService } from '../services/AutomationRuleService';

export class AutomationRuleController {
  private ruleService = new AutomationRuleService();

  getRules = async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 10,
        isActive,
        sortBy,
        sortOrder,
      } = req.query;

      const [rules, total] = await this.ruleService.getRules({
        page: Number(page),
        limit: Number(limit),
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        sortBy: sortBy as any,
        sortOrder: sortOrder as 'ASC' | 'DESC',
      });

      res.json({
        rules,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Error fetching automation rules:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  createRule = async (req: Request, res: Response) => {
    try {
      const ruleData = req.body;
      const rule = await this.ruleService.createRule(ruleData);

      res.status(201).json(rule);
    } catch (error: any) {
      console.error('Error creating automation rule:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getRuleById = async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const rule = await this.ruleService.getRuleById(id);

      if (!rule) {
        return res.status(404).json({ error: 'Automation rule not found' });
      }

      res.json(rule);
    } catch (error: any) {
      console.error('Error fetching automation rule by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  updateRule = async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const ruleData = req.body;

      const rule = await this.ruleService.updateRule(id, ruleData);

      if (!rule) {
        return res.status(404).json({ error: 'Automation rule not found' });
      }

      res.json(rule);
    } catch (error: any) {
      console.error('Error updating automation rule:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  deleteRule = async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const deleted = await this.ruleService.deleteRule(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Automation rule not found' });
      }

      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting automation rule:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  toggleRuleStatus = async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const rule = await this.ruleService.toggleRuleStatus(id);

      if (!rule) {
        return res.status(404).json({ error: 'Automation rule not found' });
      }

      res.json(rule);
    } catch (error: any) {
      console.error('Error toggling automation rule status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}