import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../models/users.model';
import { Sequelize } from 'sequelize-typescript';
import { Wallets } from '../models/wallets.model';
import { Opportunities } from '../models/opportunities.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private readonly userModel: typeof Users,
    @InjectModel(Opportunities)
    private readonly opportunityModel: typeof Opportunities,
    @InjectModel(Wallets)
    private readonly walletModel: typeof Wallets,
    private readonly sequelize: Sequelize,
  ) {}

  async meUser(id: string): Promise<Users> {
    const user = await this.userModel.scope('me_view').findOne({
      where: { id },
      include: [
        {
          model: Wallets,
          required: false,
        },
      ],
    });
    return user;
  }

  async findAndCountuserBalances(
    id: string,
    query,
  ): Promise<{ rows: Opportunities[]; count: number }> {
    const options: any = {
      where: {},
    };

    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    options.distinct = true;

    options.include = [
      {
        model: Users,
        required: true,
        where: { id },
      },
    ];

    const opportunities = await this.opportunityModel.findAndCountAll(options);
    return opportunities;
  }

  async addMoneyToBalance(user_id, amount) {
    const wallet = await this.walletModel.findOne({
      where: { user_id },
    });
    if (!wallet) throw new NotFoundException('Wallet from user doesnt exist');
    wallet.balance = Number(wallet.balance) + Number(amount);
    wallet.save();
  }
}
