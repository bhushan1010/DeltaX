import { Request, Response } from 'express';
import { LeadService } from '../services/LeadService';

export class LeadController {
  private leadService = new LeadService();

  getLeads = async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        source,
        assignedTo,
        search,
        sortBy,
        sortOrder,
      } = req.query;

      const [leads, total] = await this.leadService.getLeads({
        page: Number(page),
        limit: Number(limit),
        status: status ? [status as string] : undefined,
        source: source ? [source as string] : undefined,
        assignedTo: assignedTo as string | undefined,
        search: search as string | undefined,
        sortBy: sortBy as keyof any,
        sortOrder: sortOrder as 'ASC' | 'DESC',
      });

      res.json({
        leads,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getLeadById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const lead = await this.leadService.getLeadById(id);

      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      res.json(lead);
    } catch (error: any) {
      console.error('Error fetching lead by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  createLead = async (req: Request, res: Response) => {
    try {
      const leadData = req.body;
      const { assignedTo } = req.body; // Assuming assignedTo is passed separately

      const lead = await this.leadService.createLead(leadData, assignedTo);
      
      // Emit socket event for new lead
      const io = req.app.get('io');
      if (io) {
        io.emit('lead_created', lead);
      }

      res.status(201).json(lead);
    } catch (error: any) {
      console.error('Error creating lead:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  updateLead = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const leadData = req.body;

      const lead = await this.leadService.updateLead(id, leadData);

      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      
      // Emit socket event for lead update
      const io = req.app.get('io');
      if (io) {
        io.to(id).emit('lead_updated', lead); // Send to lead-specific room
      }

      res.json(lead);
    } catch (error: any) {
      console.error('Error updating lead:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  deleteLead = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await this.leadService.deleteLead(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      
      // Emit socket event for lead deletion
      const io = req.app.get('io');
      if (io) {
        io.emit('lead_deleted', { id });
      }

      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  assignLead = async (req: Request, res: Response) => {
    try {
      const { leadId, userId } = req.body;

      if (!leadId || !userId) {
        return res.status(400).json({ error: 'Lead ID and User ID are required' });
      }

      const lead = await this.leadService.assignLead(leadId, userId);

      if (!lead) {
        return res.status(404).json({ error: 'Lead or User not found' });
      }
      
      // Emit socket event for lead assignment
      const io = req.app.get('io');
      if (io) {
        io.to(leadId).emit('lead_assigned', lead); // Send to lead-specific room
        // Also notify the assigned user
        io.to(`user_${userId}`).emit('lead_assigned', lead);
      }

      res.json(lead);
    } catch (error: any) {
      console.error('Error assigning lead:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  updateLeadStatus = async (req: Request, res: Response) => {
    try {
      const { leadId } = req.params;
      const { status } = req.body;
      const { userId } = req.body; // In a real app, this would come from auth middleware

      if (!leadId || !status) {
        return res.status(400).json({ error: 'Lead ID and status are required' });
      }

      const lead = await this.leadService.updateLeadStatus(leadId, status, userId || '');

      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      
      // Emit socket event for status change
      const io = req.app.get('io');
      if (io) {
        io.to(leadId).emit('status_changed', lead); // Send to lead-specific room
        // Also notify the user involved
        if (lead.assigned_to) {
          io.to(`user_${lead.assigned_to.id}`).emit('status_changed', lead);
        }
      }

      res.json(lead);
    } catch (error: any) {
      console.error('Error updating lead status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}