import { Lead, User } from '../entity';
import { AppDataSource } from '../config/ormconfig';
import { Repository } from 'typeorm';

export class LeadService {
  private leadRepository: Repository<Lead>;
  private userRepository: Repository<User>;

  constructor() {
    this.leadRepository = AppDataSource.getRepository(Lead);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createLead(leadData: Partial<Lead>, assignedToId?: string): Promise<Lead> {
    const lead = this.leadRepository.create({
      ...leadData,
      assigned_to: assignedToId ? { id: assignedToId } : undefined,
    });

    return await this.leadRepository.save(lead);
  }

  async getLeads(options: {
    page?: number;
    limit?: number;
    status?: string[];
    source?: string[];
    assignedTo?: string;
    search?: string;
    sortBy?: keyof Lead;
    sortOrder?: 'ASC' | 'DESC';
  } = {}): Promise<[Lead[], number]> {
    const {
      page = 1,
      limit = 10,
      status,
      source,
      assignedTo,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = options;

    const skip = (page - 1) * limit;

    const queryBuilder = this.leadRepository.createQueryBuilder('lead')
      .leftJoinAndSelect('lead.assigned_to', 'assignedTo')
      .skip(skip)
      .take(limit)
      .orderBy(`lead.${sortBy}`, sortOrder);

    if (status && status.length > 0) {
      queryBuilder.andWhere('lead.status IN (:...status)', { status });
    }

    if (source && source.length > 0) {
      queryBuilder.andWhere('lead.source IN (:...source)', { source });
    }

    if (assignedTo) {
      queryBuilder.andWhere('lead.assigned_to = :assignedTo', { assignedTo });
    }

    if (search) {
      queryBuilder.andWhere(
        '(lead.first_name ILIKE :search OR lead.last_name ILIKE :search OR lead.email ILIKE :search OR lead.phone ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [leads, total] = await queryBuilder.getManyAndCount();

    return [leads, total];
  }

  async getLeadById(id: string): Promise<Lead | null> {
    return await this.leadRepository.findOneBy({ id });
  }

  async updateLead(id: string, leadData: Partial<Lead>): Promise<Lead | null> {
    await this.leadRepository.update(id, leadData);
    return await this.leadRepository.findOneBy({ id });
  }

  async deleteLead(id: string): Promise<boolean> {
    const result = await this.leadRepository.delete(id);
    return result.affected !== 0;
  }

  async assignLead(leadId: string, userId: string): Promise<Lead | null> {
    const lead = await this.leadRepository.findOneBy({ id: leadId });
    if (!lead) {
      return null;
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return null;
    }

    lead.assigned_to = user;
    lead.assigned_at = new Date();

    return await this.leadRepository.save(lead);
  }

  async updateLeadStatus(leadId: string, status: Lead['status'], userId: string): Promise<Lead | null> {
    const lead = await this.leadRepository.findOneBy({ id: leadId });
    if (!lead) {
      return null;
    }

    // We could also create a lead status history entry here, but for simplicity we'll just update the status
    lead.status = status;
    lead.updated_at = new Date();

    return await this.leadRepository.save(lead);
  }
}