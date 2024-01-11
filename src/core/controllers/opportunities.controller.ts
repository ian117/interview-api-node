import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OpportunitiesService } from '../services/opportunities.service';
import { PaginationQueryDTO } from '../dtos/pagination.dto';
import { getPagination, getPagingData } from '../helpers/paginations';
import { requestUser } from 'src/common/interfaces/common.interface';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateOpportunityDTO,
  OpportunityParamsDTO,
  UpdateOpportunityDto,
} from '../dtos/opportunities.dto';

@ApiTags('Opportunities')
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @UseGuards(AuthGuard('jwt-token'))
  @Get()
  async filter(@Query() query: PaginationQueryDTO) {
    const { page, size } = query;
    const { limit, offset } = getPagination(page, size);
    query.limit = limit;
    query.offset = offset;

    const opportunities = await this.opportunitiesService.findAndCount(query);
    const results = getPagingData(opportunities, page, limit);
    return results;
  }

  @UseGuards(AuthGuard('custom-admin-token'))
  @Get('admin/')
  async filterByAdmin(@Query() query: PaginationQueryDTO) {
    const { page, size } = query;
    const { limit, offset } = getPagination(page, size);
    query.limit = limit;
    query.offset = offset;

    const opportunities =
      await this.opportunitiesService.findAndCountByAdmin(query);
    const results = getPagingData(opportunities, page, limit);
    return results;
  }

  @UseGuards(AuthGuard('custom-admin-token'))
  @Post('admin/')
  async create(@Body() opportunityObject: CreateOpportunityDTO) {
    return await this.opportunitiesService.addOne(opportunityObject);
  }

  @UseGuards(AuthGuard('custom-admin-token'))
  @Put('admin/:id')
  async edit(
    @Param() { id }: OpportunityParamsDTO,
    @Body() opportunityObject: UpdateOpportunityDto,
  ) {
    return await this.opportunitiesService.updateOne(id, opportunityObject);
  }

  @UseGuards(AuthGuard('custom-admin-token'))
  @Delete('admin/:id')
  async remove(@Param() { id }: OpportunityParamsDTO) {
    return await this.opportunitiesService.deleteOne(id);
  }

  @UseGuards(AuthGuard(['jwt-token', 'custom-admin-token']))
  @Get(':id')
  async getOne(@Param() { id }: OpportunityParamsDTO) {
    return await this.opportunitiesService.findOneOr404(id);
  }

  @UseGuards(AuthGuard('jwt-token'))
  @Post('investment')
  async addInvestment() {}

  @UseGuards(AuthGuard('jwt-token'))
  @Delete('investment')
  async removeInvestment() {}
}
