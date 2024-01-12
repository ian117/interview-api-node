import {
  BadRequestException,
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
import { UsersOpportunitiesPivot } from '../models/users-opportunities.model';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectModel(Opportunities)
    private readonly opportunityModel: typeof Opportunities,
    @InjectModel(Users)
    private readonly userModel: typeof Users,
    @InjectModel(Wallets)
    private readonly walletModel: typeof Wallets,
    @InjectModel(UsersOpportunitiesPivot)
    private readonly usersOpportunitiesPivotModel: typeof UsersOpportunitiesPivot,
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

    // TODO If opportunityObject.quantity exist AND user-Opportunities exist --> check if not LOWER thant current value opportunity.quantity

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

  async addInvestment(userId, opportunityId, investmentAmount) {
    const opportunity = await this.findOneOr404(opportunityId);

    const wallet = await this.getUserWallet(userId);

    await this.canInvestOr400(wallet, investmentAmount);

    const investment = await this.restoreOrCreateInvestment(
      userId,
      opportunityId,
      investmentAmount,
      wallet,
    );

    return investment;
  }

  async removeInvestment(id) {
    // TODO remove investment
  }

  async findOneOr404(opportunityId) {
    const opportunity = await this.opportunityModel.findByPk(opportunityId);
    if (!opportunity)
      throw new NotFoundException('Not found Inversion Opportunity');
    return opportunity;
  }

  private async getUserWallet(user_id) {
    const wallet = await this.walletModel.findOne({
      where: { user_id },
    });
    if (!wallet) throw new NotFoundException("User don't have a wallet");
    return wallet;
  }

  private async canInvestOr400(wallet: Wallets, investmentAmount: number) {
    if (wallet.balance < investmentAmount) {
      throw new BadRequestException(
        "User don't have enough founds for this operation. Please provide an amount that the balance in the Wallet can operate with",
      );
    }
  }

  private async restoreOrCreateInvestment(
    userId,
    opportunityId,
    investmentAmount,
    wallet: Wallets,
  ) {
    const investmentExist = await this.getInvestmentWithParanoid(
      userId,
      opportunityId,
    );

    if (!investmentExist) {
      const transaction = await this.sequelize.transaction();
      try {
        const investmentCreated =
          await this.usersOpportunitiesPivotModel.create(
            {
              user_id: userId,
              opportunity_id: opportunityId,
              investment_amount: investmentAmount,
            },
            { transaction },
          );

        wallet.balance = wallet.balance - investmentAmount;
        await wallet.save({ transaction });

        await transaction.commit();

        return investmentCreated;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } else {
      if (!investmentExist.deleted_at) {
        throw new ConflictException(
          'An Open Investment Exist already. Removed first to make another in the same Investment Opportunity',
        );
      }

      const transaction = await this.sequelize.transaction();
      try {
        investmentExist.investment_amount = investmentAmount;
        await investmentExist.save({ transaction });

        await investmentExist.restore({ transaction });

        wallet.balance = wallet.balance - investmentAmount;
        await wallet.save({ transaction });

        await transaction.commit();

        return investmentExist;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  }

  private async getInvestmentWithParanoid(userId, opportunityId) {
    const investment = await this.usersOpportunitiesPivotModel.findOne({
      where: {
        user_id: userId,
        opportunity_id: opportunityId,
      },
      paranoid: false,
    });
    return investment;
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
