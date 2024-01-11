import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Users } from './models/users.model';
import { Wallets } from './models/wallets.model';
import { Opportunities } from './models/opportunities.model';
import { UsersOpportunitiesPivot } from './models/users-opportunities.model';

import { UsersController } from './controllers/users.controller';
import { OpportunitiesController } from './controllers/opportunities.controller';

import { CoreService } from './core.service';
import { UsersService } from './services/users.service';
import { OpportunitiesService } from './services/opportunities.service';

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
  providers: [CoreService, UsersService, OpportunitiesService],
})
export class CoreModule {}
