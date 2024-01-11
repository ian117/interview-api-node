import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    // This make the Admin Service unique, using soft delete search
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

  async addOne(opportunityObject) {
    await this.ifExistByNameThrow409(opportunityObject.title);

    const transaction = await this.sequelize.transaction();
    try {
      const opportunity = await this.opportunityModel.create(
        opportunityObject,
        {
          transaction,
        },
      );

      await transaction.commit();

      return opportunity;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  async updateOne(opportunityId, opportunityObject) {
    const opportunity = await this.findOneOr404(opportunityId);

    if (opportunityObject.title) {
      await this.ifExistByNameThrow409(opportunityObject.title);
    }

    const transaction = await this.sequelize.transaction();
    try {
      const editedOpportunity = await opportunity.update(opportunityObject, {
        transaction,
      });

      await transaction.commit();

      return editedOpportunity;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteOne(opportunityId) {
    const opportunity = await this.findOneOr404(opportunityId);

    // TODO if user-opportunities exist -> throw 409

    const transaction = await this.sequelize.transaction();
    try {
      const removedOpportunity = await opportunity.destroy({ transaction });

      await transaction.commit();

      return removedOpportunity;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findOneOr404(opportunityId) {
    const opportunity = await this.opportunityModel.findByPk(opportunityId);
    if (!opportunity)
      throw new NotFoundException('Not found Inversion Opportunity');
    return opportunity;
  }

  private async ifExistByNameThrow409(title) {
    const opportunity = await this.opportunityModel.findOne({
      where: { title },
    });
    if (opportunity)
      throw new ConflictException(
        'An Inversion Opportunity already have that name',
      );
  }
}
