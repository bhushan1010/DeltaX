import { LeadActivity } from '../entity/LeadActivity';
import { AppDataSource } from '../config/ormconfig';
import { Repository } from 'typeorm';

export class LeadActivityService {
  private activityRepository: Repository<LeadActivity>;

  constructor() {
    this.activityRepository = AppDataSource.getRepository(LeadActivity);
  }

  async createActivity(activityData: Partial<LeadActivity>): Promise<LeadActivity> {
    const activity = this.activityRepository.create(activityData);
    return await this.activityRepository.save(activity);
  }

  async getActivitiesByLeadId(leadId: string, options: {
    page?: number;
    limit?: number;
    activityType?: string[];
    sortBy?: keyof LeadActivity;
    sortOrder?: 'ASC' | 'DESC';
  } = {}): Promise<[LeadActivity[], number]> {
    const {
      page = 1,
      limit = 10,
      activityType,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = options;

    const skip = (page - 1) * limit;

    const queryBuilder = this.activityRepository.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.lead', 'lead')
      .leftJoinAndSelect('activity.user', 'user')
      .where('activity.lead_id = :leadId', { leadId })
      .skip(skip)
      .take(limit)
      .orderBy(`activity.${sortBy}`, sortOrder);

    if (activityType && activityType.length > 0) {
      queryBuilder.andWhere('activity.activity_type IN (:...activityType)', { activityType });
    }

    const [activities, total] = await queryBuilder.getManyAndCount();

    return [activities, total];
  }

  async getActivityById(id: string): Promise<LeadActivity | null> {
    return await this.activityRepository.findOneBy({ id });
  }

  async updateActivity(id: string, activityData: Partial<LeadActivity>): Promise<LeadActivity | null> {
    await this.activityRepository.update(id, activityData);
    return await this.activityRepository.findOneBy({ id });
  }

  async deleteActivity(id: string): Promise<boolean> {
    const result = await this.activityRepository.delete(id);
    return result.affected !== 0;
  }

  async completeActivity(id: string): Promise<LeadActivity | null> {
    const activity = await this.activityRepository.findOneBy({ id });
    if (!activity) {
      return null;
    }

    activity.completed_at = new Date();
    return await this.activityRepository.save(activity);
  }
}