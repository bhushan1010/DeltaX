import { Request, Response } from 'express';
import { LeadActivityService } from '../services/LeadActivityService';

export class LeadActivityController {
  private activityService = new LeadActivityService();

  getActivitiesByLeadId = async (req: Request, res: Response) => {
    try {
      const leadId = String(req.params.leadId);
      const {
        page = 1,
        limit = 10,
        activityType,
        sortBy,
        sortOrder,
      } = req.query;

      const [activities, total] = await this.activityService.getActivitiesByLeadId(leadId, {
        page: Number(page),
        limit: Number(limit),
        activityType: Array.isArray(activityType) ? (activityType as string[]) : activityType ? [activityType as string] : undefined,
        sortBy: sortBy as any,
        sortOrder: sortOrder as 'ASC' | 'DESC',
      });

      res.json({
        activities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Error fetching lead activities:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  createActivity = async (req: Request, res: Response) => {
    try {
      const activityData = req.body;
      const activity = await this.activityService.createActivity(activityData);

      res.status(201).json(activity);
    } catch (error: any) {
      console.error('Error creating lead activity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getActivityById = async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const activity = await this.activityService.getActivityById(id);

      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      res.json(activity);
    } catch (error: any) {
      console.error('Error fetching activity by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  updateActivity = async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const activityData = req.body;

      const activity = await this.activityService.updateActivity(id, activityData);

      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      res.json(activity);
    } catch (error: any) {
      console.error('Error updating activity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  deleteActivity = async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const deleted = await this.activityService.deleteActivity(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  completeActivity = async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const activity = await this.activityService.completeActivity(id);

      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      res.json(activity);
    } catch (error: any) {
      console.error('Error completing activity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}