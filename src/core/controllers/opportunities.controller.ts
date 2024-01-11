import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Opportunities')
@Controller('opportunities')
export class OpportunitiesController {
  @Get()
  filter() {}

  @Post()
  create() {}

  @Put()
  edit() {}

  @Delete()
  remove() {}

  @Post('investment')
  addInvestment() {}

  @Delete('investment')
  removeInvestment() {}
}
