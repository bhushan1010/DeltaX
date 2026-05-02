import { AutomationRule } from '../entity/AutomationRule';
import { AppDataSource } from '../config/ormconfig';
import { Repository } from 'typeorm';

export class AutomationRuleService {
  private ruleRepository: Repository<AutomationRule>;

  constructor() {
    this.ruleRepository = AppDataSource.getRepository(AutomationRule);
  }

  async createRule(ruleData: Partial<AutomationRule>): Promise<AutomationRule> {
    const rule = this.ruleRepository.create(ruleData);
    return await this.ruleRepository.save(rule);
  }

  async getRules(options: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    sortBy?: keyof AutomationRule;
    sortOrder?: 'ASC' | 'DESC';
  } = {}): Promise<[AutomationRule[], number]> {
    const {
      page = 1,
      limit = 10,
      isActive,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = options;

    const skip = (page - 1) * limit;

    const queryBuilder = this.ruleRepository.createQueryBuilder('rule');

    if (isActive !== undefined) {
      queryBuilder.andWhere('rule.is_active = :isActive', { isActive });
    }

    queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy(`rule.${sortBy}`, sortOrder);

    const [rules, total] = await queryBuilder.getManyAndCount();

    return [rules, total];
  }

  async getRuleById(id: string): Promise<AutomationRule | null> {
    return await this.ruleRepository.findOneBy({ id });
  }

  async updateRule(id: string, ruleData: Partial<AutomationRule>): Promise<AutomationRule | null> {
    await this.ruleRepository.update(id, ruleData);
    return await this.ruleRepository.findOneBy({ id });
  }

  async deleteRule(id: string): Promise<boolean> {
    const result = await this.ruleRepository.delete(id);
    return result.affected !== 0;
  }

  async toggleRuleStatus(id: string): Promise<AutomationRule | null> {
    const rule = await this.ruleRepository.findOneBy({ id });
    if (!rule) {
      return null;
    }

    rule.is_active = !rule.is_active;
    return await this.ruleRepository.save(rule);
  }
}