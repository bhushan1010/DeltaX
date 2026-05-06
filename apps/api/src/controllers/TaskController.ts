import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { ProjectService } from '../services/ProjectService';
import { TaskStatus } from '../entity/Task';
import { UserRole, hasMinimumRole } from '../entity/User';

export class TaskController {
  private taskService = new TaskService();
  private projectService = new ProjectService();

  // G2 fix: verify caller is a member of the project before creating a task
  createTask = async (req: Request, res: Response) => {
    try {
      const { title, description, projectId, assigneeId, dueDate } = req.body;

      if (!title || !projectId) {
        return res.status(400).json({ error: 'Title and projectId are required' });
      }

      const callerRole = req.user?.role;
      const callerId = req.user?.id;

      // Admins & managers may create tasks in any project;
      // leads & workers must belong to the project first
      const isManagerOrAbove = hasMinimumRole(callerRole as UserRole, UserRole.MANAGER);
      if (!isManagerOrAbove) {
        const project = await this.projectService.getProjectById(parseInt(projectId));
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
        const isMember = project.members.some((m) => m.user.id === callerId);
        if (!isMember) {
          return res.status(403).json({ error: 'Forbidden: You are not a member of this project' });
        }
      }

      const task = await this.taskService.createTask(title, description, projectId, assigneeId, dueDate);
      return res.status(201).json(task);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  getTasksByProject = async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId as string);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: 'Valid projectId is required' });
      }

      const { status, assigneeId } = req.query;
      const filters: any = {};

      if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
        filters.status = status as TaskStatus;
      }
      if (assigneeId) {
        filters.assigneeId = parseInt(assigneeId as string);
      }

      const tasks = await this.taskService.getTasksByProject(projectId, filters);
      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  getAllTasks = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      const { status, projectId } = req.query;
      const filters: any = {};

      if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
        filters.status = status as TaskStatus;
      }
      if (projectId) {
        filters.projectId = parseInt(projectId as string);
      }

      const tasks = await this.taskService.getAllTasks(userId, filters, userRole);
      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  // Admins & managers get global stats; leads & workers get personal stats
  getTaskStats = async (req: Request, res: Response) => {
    try {
      const userRole = req.user?.role as UserRole;
      const isManagerOrAbove = hasMinimumRole(userRole, UserRole.MANAGER);
      const userId = isManagerOrAbove ? undefined : req.user?.id;
      const stats = await this.taskService.getTaskStats(userId);
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  // G3 fix: only admins or the task's current assignee may update a task
  updateTask = async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id as string);
      const callerId = req.user?.id;
      const callerRole = req.user?.role;

      // Fetch the existing task to check ownership
      const existing = await this.taskService.getTaskById(taskId);
      if (!existing) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Managers & above can update any task; leads/workers can only update their own
      const isManagerOrAbove = hasMinimumRole(callerRole as UserRole, UserRole.MANAGER);
      const isAssignee = existing.assignee?.id === callerId;

      if (!isManagerOrAbove && !isAssignee) {
        return res.status(403).json({ error: 'Forbidden: You can only update tasks assigned to you' });
      }

      const task = await this.taskService.updateTask(taskId, req.body);
      return res.status(200).json(task);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  // Route-level requireManager already blocks workers & leads
  deleteTask = async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id as string);
      const success = await this.taskService.deleteTask(taskId);

      if (!success) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };
}
