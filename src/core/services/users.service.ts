import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../models/users.model';
import { Sequelize } from 'sequelize-typescript';
import { Wallets } from '../models/wallets.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private readonly userModel: typeof Users,
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
}
