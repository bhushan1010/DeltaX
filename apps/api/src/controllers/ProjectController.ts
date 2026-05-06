import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';
import { ProjectRole } from '../entity/ProjectMember';

export class ProjectController {
  private projectService = new ProjectService();

  createProject = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const ownerId = req.user.id;

      if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
      }

      const project = await this.projectService.createProject(name, description, ownerId);
      return res.status(201).json(project);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  getProjects = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const projects = await this.projectService.getProjectsForUser(userId);
      return res.status(200).json(projects);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  getProjectById = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id as string);
      const project = await this.projectService.getProjectById(projectId);

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Check if user is a member
      const isMember = project.members.some(m => m.user.id === req.user.id);
      if (!isMember) {
        return res.status(403).json({ error: 'Forbidden: You are not a member of this project' });
      }

      return res.status(200).json(project);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  updateProject = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id as string);
      const updateData = req.body;

      const project = await this.projectService.updateProject(projectId, updateData);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.status(200).json(project);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  deleteProject = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id as string);
      const success = await this.projectService.deleteProject(projectId);

      if (!success) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  addMember = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id as string);
      const { userId, role } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const projectRole = role === 'ADMIN' ? ProjectRole.ADMIN : ProjectRole.MEMBER;
      const member = await this.projectService.addMember(projectId, userId, projectRole);

      return res.status(201).json(member);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  removeMember = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id as string);
      const userId    = parseInt(req.params.userId as string);

      if (isNaN(projectId) || isNaN(userId)) {
        return res.status(400).json({ error: 'Valid projectId and userId are required' });
      }

      const success = await this.projectService.removeMember(projectId, userId);
      if (!success) {
        return res.status(404).json({ error: 'Member not found in this project' });
      }

      return res.status(200).json({ message: 'Member removed successfully' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}
