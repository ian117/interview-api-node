import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Users } from '../core/models/users.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users)
    private readonly userModel: typeof Users,
    private readonly sequelize: Sequelize,
  ) {}

  async getOrCreate(email: string | undefined): Promise<Users> {
    if (email === undefined) {
      throw new InternalServerErrorException('Not email provided in service');
    }

    let user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      const transaction = await this.sequelize.transaction();
      try {
        user = await this.userModel.create(
          {
            first_name: '',
            last_name: '',
            email: email.toLocaleLowerCase(),
            password: '',
          },
          { transaction },
        );
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
    return user;
  }
}
