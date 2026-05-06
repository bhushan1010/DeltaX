import { AppDataSource } from '../config/ormconfig';
import { Project } from '../entity/Project';
import { ProjectMember, ProjectRole } from '../entity/ProjectMember';
import { User } from '../entity/User';

export class ProjectService {
  projectRepository = AppDataSource.getRepository(Project);
  projectMemberRepository = AppDataSource.getRepository(ProjectMember);
  userRepository = AppDataSource.getRepository(User);

  async createProject(name: string, description: string, ownerId: number): Promise<Project> {
    const owner = await this.userRepository.findOneBy({ id: ownerId });
    if (!owner) throw new Error('Owner not found');

    const project = this.projectRepository.create({
      name,
      description,
      owner,
    });

    const savedProject = await this.projectRepository.save(project);

    // Automatically add the owner as a project admin
    const projectMember = this.projectMemberRepository.create({
      project: savedProject,
      user: owner,
      role: ProjectRole.ADMIN,
    });
    await this.projectMemberRepository.save(projectMember);

    return savedProject;
  }

  async getProjectsForUser(userId: number): Promise<Project[]> {
    // Find all projects where the user is a member or owner
    const memberships = await this.projectMemberRepository.find({
      where: { user: { id: userId } },
      relations: ['project', 'project.owner'],
    });

    return memberships.map((m) => m.project);
  }

  async getProjectById(projectId: number): Promise<Project | null> {
    return await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner', 'members', 'members.user', 'tasks'],
    });
  }

  async updateProject(projectId: number, updateData: Partial<Project>): Promise<Project | null> {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) return null;

    Object.assign(project, updateData);
    return await this.projectRepository.save(project);
  }

  async deleteProject(projectId: number): Promise<boolean> {
    const result = await this.projectRepository.delete(projectId);
    return (result.affected ?? 0) > 0;
  }

  async addMember(projectId: number, userId: number, role: ProjectRole): Promise<ProjectMember> {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) throw new Error('Project not found');

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');

    const existingMember = await this.projectMemberRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } }
    });
    if (existingMember) throw new Error('User is already a member of this project');

    const member = this.projectMemberRepository.create({
      project,
      user,
      role,
    });

    return await this.projectMemberRepository.save(member);
  }

  async removeMember(projectId: number, userId: number): Promise<boolean> {
    const member = await this.projectMemberRepository.findOne({
      where: { project: { id: projectId }, user: { id: userId } },
    });
    if (!member) return false;

    await this.projectMemberRepository.remove(member);
    return true;
  }
}

