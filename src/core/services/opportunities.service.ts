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
      order: [],
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const { id } = query;
    if (id) {
      options.where.id = id;
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

    if (opportunityObject.total_amount) {
      if (opportunityObject.total_amount < opportunity.total_amount) {
        const investmentsCount =
          await this.opportunityInvestmentsCount(opportunityId);
        if (investmentsCount > 0) {
          throw new ConflictException(
            'Total amount only can go Up when this Inversion Opportunity have Investments already',
          );
        }
      }
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

    await this.ifOpportunityHaveInvestmentsThrow409(opportunityId);

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

  async deleteInvestment(userId, opportunityId) {
    const opportunity = await this.findOneOr404(opportunityId);

    const wallet = await this.getUserWallet(userId);

    const investment = await this.removeInvestment(
      userId,
      opportunityId,
      wallet,
    );
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

  private async ifOpportunityHaveInvestmentsThrow409(opportunityId) {
    const investmentsCount = await this.usersOpportunitiesPivotModel.count({
      where: { opportunity_id: opportunityId },
      paranoid: false,
    });

    if (investmentsCount > 0)
      throw new ConflictException(
        "Can't remove this Inversion Opportunity because have child records with the User-Opportunities model",
      );
  }

  private async opportunityInvestmentsCount(opportunityId) {
    const investmentsCount = await this.usersOpportunitiesPivotModel.count({
      where: { opportunity_id: opportunityId },
    });

    return investmentsCount;
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

        wallet.balance = Number(wallet.balance) - Number(investmentAmount);
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

  private async removeInvestment(userId, opportunityId, wallet: Wallets) {
    const investmentExist = await this.getInvestmentWithParanoid(
      userId,
      opportunityId,
    );

    if (!investmentExist || investmentExist.deleted_at)
      throw new NotFoundException(
        "The user doesn't have investments on this Inversion Opportunity",
      );

    const transaction = await this.sequelize.transaction();
    try {
      wallet.balance =
        Number(wallet.balance) + Number(investmentExist.investment_amount);
      await wallet.save({ transaction });
      investmentExist.investment_amount = 0;
      await investmentExist.save({ transaction });
      await investmentExist.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
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
