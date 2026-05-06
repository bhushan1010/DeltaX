import { AppDataSource } from '../config/ormconfig';
import { Task, TaskStatus } from '../entity/Task';
import { Project } from '../entity/Project';
import { User } from '../entity/User';
import { ProjectMember } from '../entity/ProjectMember';

export class TaskService {
  taskRepository = AppDataSource.getRepository(Task);
  projectRepository = AppDataSource.getRepository(Project);
  userRepository = AppDataSource.getRepository(User);
  projectMemberRepository = AppDataSource.getRepository(ProjectMember);

  // G2 support: check if a user is a member of a given project
  async isProjectMember(projectId: number, userId: number): Promise<boolean> {
    const membership = await this.projectMemberRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
    });
    return !!membership;
  }

  async createTask(title: string, description: string, projectId: number, assigneeId?: number, dueDate?: Date): Promise<Task> {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) throw new Error('Project not found');

    let assignee: User | null = null;
    if (assigneeId) {
      assignee = await this.userRepository.findOneBy({ id: assigneeId });
    }

    const task = this.taskRepository.create({
      title,
      description,
      project,
      assignee,
      due_date: dueDate,
      status: TaskStatus.TODO
    });

    return await this.taskRepository.save(task);
  }

  async getTasksByProject(projectId: number, filters?: { status?: TaskStatus; assigneeId?: number }): Promise<Task[]> {
    const where: any = { project: { id: projectId } };
    
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.assigneeId) {
      where.assignee = { id: filters.assigneeId };
    }

    return await this.taskRepository.find({
      where,
      relations: ['assignee', 'project'],
      order: { created_at: 'DESC' }
    });
  }

  async getAllTasks(userId?: number, filters?: { status?: TaskStatus; projectId?: number }, role?: string): Promise<Task[]> {
    const where: any = {};

    // Members only see their own assigned tasks; admins see all
    if (userId && role !== 'admin') {
      where.assignee = { id: userId };
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.projectId) {
      where.project = { id: filters.projectId };
    }

    return await this.taskRepository.find({
      where,
      relations: ['assignee', 'project'],
      order: { created_at: 'DESC' }
    });
  }

  async getTaskStats(userId?: number): Promise<{ total: number; todo: number; inProgress: number; review: number; done: number; overdue: number; myTasks: number }> {
    const where: any = {};
    if (userId) {
      where.assignee = { id: userId };
    }

    const tasks = await this.taskRepository.find({
      where,
      relations: ['assignee']
    });

    const now = new Date();
    const todo = tasks.filter(t => t.status === TaskStatus.TODO).length;
    const inProgress = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    const review = tasks.filter(t => t.status === TaskStatus.REVIEW).length;
    const done = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < now && t.status !== TaskStatus.DONE).length;
    const myTasks = userId ? tasks.filter(t => t.assignee?.id === userId).length : 0;

    return {
      total: tasks.length,
      todo,
      inProgress,
      review,
      done,
      overdue,
      myTasks
    };
  }

  async getTaskById(taskId: number): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project', 'assignee']
    });
  }

  // G5 fix: properly resolve and persist the assignee relation
  async updateTask(
    taskId: number,
    updateData: Partial<Task> & { assigneeId?: number | null }
  ): Promise<Task | null> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['assignee', 'project'],
    });
    if (!task) return null;

    // Handle assignee separately so we can do a proper DB lookup
    if ('assigneeId' in updateData) {
      if (updateData.assigneeId == null) {
        task.assignee = null as any;
      } else {
        const assignee = await this.userRepository.findOneBy({ id: updateData.assigneeId as number });
        if (!assignee) throw new Error('Assignee not found');
        task.assignee = assignee;
      }
    } else if ('assignee' in updateData) {
      // Support legacy object-style from older callers: { assignee: { id } }
      const rawAssignee = updateData.assignee as any;
      if (rawAssignee == null) {
        task.assignee = null as any;
      } else if (rawAssignee?.id) {
        const assignee = await this.userRepository.findOneBy({ id: rawAssignee.id });
        if (!assignee) throw new Error('Assignee not found');
        task.assignee = assignee;
      }
    }

    // Patch safe primitive fields
    const { assigneeId: _aid, assignee: _aobj, project: _proj, ...primitives } = updateData as any;
    Object.assign(task, primitives);

    return await this.taskRepository.save(task);
  }

  async deleteTask(taskId: number): Promise<boolean> {
    const result = await this.taskRepository.delete(taskId);
    return (result.affected ?? 0) > 0;
  }
}
