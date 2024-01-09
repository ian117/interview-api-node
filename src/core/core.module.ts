import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Users } from './models/users.model';
import { Wallets } from './models/wallets.model';
import { Opportunities } from './models/opportunities.model';
import { UsersOpportunitiesPivot } from './models/users-opportunities.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Users,
      Wallets,
      Opportunities,
      UsersOpportunitiesPivot,
    ]),
  ],
})
export class CoreModule {}
