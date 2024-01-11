import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../models/users.model';
import { Opportunities } from '../models/opportunities.model';
import { Wallets } from '../models/wallets.model';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectModel(Opportunities)
    private readonly opportunityModel: typeof Opportunities,
    @InjectModel(Users)
    private readonly userModel: typeof Users,
    @InjectModel(Wallets)
    private readonly walletModel: typeof Wallets,
    private readonly sequelize: Sequelize,
  ) {}

  async findAndCount(
    query: any,
  ): Promise<{ rows: Opportunities[]; count: number }> {
    const options: any = {
      where: {},
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const { id } = query;
    if (id) {
      options.where.id = { [Op.iLike]: `%${id}%` };
    }

    const { title } = query;
    if (title) {
      options.where.title = { [Op.iLike]: `%${title}%` };
    }

    const { total_amount_between_1, total_amount_between_2 } = query;
    if (
      (total_amount_between_1 || total_amount_between_1 == '0') &&
      total_amount_between_2
    ) {
      options.where.total_amount = {
        [Op.between]: [total_amount_between_1, total_amount_between_2],
      };
    }

    const { total_amount_order } = query;
    if (total_amount_order) {
      options.order.push(['total_amount', `${total_amount_order}`]);
    }

    const { created_at_order } = query;
    if (created_at_order) {
      options.order.push(['created_at', `${created_at_order}`]);
    }

    options.distinct = true;

    return this.opportunityModel.findAndCountAll(options);
  }

  async findAndCountByAdmin(
    query: any,
  ): Promise<{ rows: Opportunities[]; count: number }> {
    const options: any = {
      where: {},
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const { id } = query;
    if (id) {
      options.where.id = { [Op.iLike]: `%${id}%` };
    }

    const { title } = query;
    if (title) {
      options.where.title = { [Op.iLike]: `%${title}%` };
    }

    const { total_amount_between_1, total_amount_between_2 } = query;
    if (
      (total_amount_between_1 || total_amount_between_1 == '0') &&
      total_amount_between_2
    ) {
      options.where.total_amount = {
        [Op.between]: [total_amount_between_1, total_amount_between_2],
      };
    }

    const { total_amount_order } = query;
    if (total_amount_order) {
      options.order.push(['total_amount', `${total_amount_order}`]);
    }

    // This make Admin Service unique
    const { soft_deleted } = query;
    if (soft_deleted) {
      options.paranoid = true;
    }

    const { created_at_order } = query;
    if (created_at_order) {
      options.order.push(['created_at', `${created_at_order}`]);
    }

    options.distinct = true;

    return this.opportunityModel.findAndCountAll(options);
  }
}
