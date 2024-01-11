import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { Users } from '../core/models/users.model';
import { ConfigService } from '@nestjs/config';
import { Wallets } from 'src/core/models/wallets.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users)
    private readonly userModel: typeof Users,
    @InjectModel(Wallets)
    private readonly walletModel: typeof Wallets,
    private readonly sequelize: Sequelize,
    private jwtService: JwtService,
    private readonly configServicre: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<Users> {
    const user = await this.findUserOr401(email);

    const correctCredentials = this.comparePasswordOr401(
      password,
      user.password,
    );

    delete user.password;
    return user;
  }

  async userInfoAuth(email: string): Promise<Users> {
    const user = await this.findUserByEmailOr401(email);
    delete user.password;
    return user;
  }

  makeUserPayloadJWT(userObject: Users): string {
    const payload = {
      first_name: userObject.first_name,
      last_name: userObject.first_name,
      sub: userObject.id, // standarts with other libraries... but i leave it just because
      id: userObject.id,
      email: userObject.email,
    };

    return this.jwtService.sign(payload);
  }

  async signUp(userObject): Promise<Users> {
    await this.ifUserExistbyEmailThrow409(userObject.email);

    const transaction = await this.sequelize.transaction();
    let user;
    try {
      userObject.password = this.hashPassword(userObject.password);
      user = await this.userModel.create(userObject, { transaction });

      const wallet = await this.walletModel.create(
        {
          user_id: user.id,
          balance: 1000,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return user;
  }

  /* Private Methods */

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

  private async findUserByEmailOr401(email): Promise<Users> {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: ['id', 'email', 'password', 'first_name', 'last_name'],
    });

    if (!user) {
      throw new UnauthorizedException(`User doesn't exist`);
    }

    return user;
  }

  private comparePasswordOr401(passwordProvided, passwordHashed): void {
    const passwordPassed = bcrypt.compareSync(passwordProvided, passwordHashed);
    if (!passwordPassed) {
      throw new UnauthorizedException(`Credentials Don't Match`);
    }
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
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }
}
