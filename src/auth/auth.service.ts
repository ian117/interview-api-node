import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

import { Users } from '../core/models/users.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users)
    private readonly userModel: typeof Users,
    private readonly sequelize: Sequelize,
  ) {}

  async login(email: string, password: string): Promise<Users> {
    const user = await this.findUserOr401(email);

    const correctCredentials = this.comparePassword(password, user.password);

    if (!correctCredentials) {
      throw new UnauthorizedException(`Credentials Don't Match`);
    }

    delete user.password;
    return user;
  }

  private async findUserOr401(email): Promise<Users> {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: ['id', 'email', 'password', 'first_name', 'last_name'],
    });

    if (!user) {
      throw new UnauthorizedException(`User doesn't exist`);
    }

    return user;
  }

  private comparePassword(passwordProvided, passwordHashed): boolean {
    return bcrypt.compareSync(passwordProvided, passwordHashed);
  }

  async signUp(userObject): Promise<Users> {
    await this.ifUserExistbyEmailThrow409(userObject.email);

    const transaction = await this.sequelize.transaction();
    let user;
    try {
      userObject.password = this.hashPassword(userObject.password);
      user = await this.userModel.create(userObject, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return user;
  }

  private async ifUserExistbyEmailThrow409(email): Promise<void> {
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (user) {
      throw new ConflictException('User already exist');
    }
  }

  private hashPassword(password): string {
    return bcrypt.hashSync(password, 10);
  }
}
