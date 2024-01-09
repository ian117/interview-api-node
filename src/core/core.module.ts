import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Users } from './models/users.model';
import { Wallets } from './models/wallets.model';
import { Opportunities } from './models/opportunities.model';
import { UsersOpportunitiesPivot } from './models/users-opportunities.model';

import { UsersController } from './controllers/users.controller';
import { OpportunitiesController } from './controllers/opportunities.controller';

import { CoreService } from './core.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Users,
      Wallets,
      Opportunities,
      UsersOpportunitiesPivot,
    ]),
  ],
  exports: [SequelizeModule],
  controllers: [UsersController, OpportunitiesController],
  providers: [CoreService],
})
export class CoreModule {}
