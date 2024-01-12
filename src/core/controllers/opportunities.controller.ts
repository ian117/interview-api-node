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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { OpportunitiesService } from '../services/opportunities.service';
import { PaginationQueryDTO } from '../dtos/pagination.dto';
import { getPagination, getPagingData } from '../helpers/paginations';
import { requestUser } from 'src/common/interfaces/common.interface';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateOpportunityDTO,
  OpportunityParamsDTO,
  UpdateOpportunityDto,
  addInvestmentBodyDTO,
} from '../dtos/opportunities.dto';

@ApiTags('Opportunities')
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @ApiOperation({
    summary: 'Filter the Inversions Opportunities',
    description: 'Filter the records with the options available',
  })
  @UseGuards(AuthGuard(['jwt-token', 'custom-admin-token']))
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

  @ApiOperation({
    summary: 'Add One Opportunity',
    description:
      'Add One Opportunity checking if one exist with the title provided, if exist, it is not saved',
  })
  @UseGuards(AuthGuard('custom-admin-token'))
  @Post('admin/')
  async create(@Body() opportunityObject: CreateOpportunityDTO) {
    return await this.opportunitiesService.addOne(opportunityObject);
  }

  @ApiOperation({
    summary: 'Edit One Opportunity',
    description:
      'Edit One Opportunity checking if one exist with the title provided, if exist, it is not saved. \n\n Also checks if the quantity provided is not lower than the current one if Inversors exist',
  })
  @UseGuards(AuthGuard('custom-admin-token'))
  @Put('admin/:id')
  async edit(
    @Param() { id }: OpportunityParamsDTO,
    @Body() opportunityObject: UpdateOpportunityDto,
  ) {
    return await this.opportunitiesService.updateOne(id, opportunityObject);
  }

  @ApiOperation({
    summary: 'Remove One Inversion Opportunity',
    description: "Remove one Inversion Opportunity if don't have Inversors",
  })
  @UseGuards(AuthGuard('custom-admin-token'))
  @Delete('admin/:id')
  async remove(@Param() { id }: OpportunityParamsDTO) {
    return await this.opportunitiesService.deleteOne(id);
  }

  @ApiOperation({
    summary: 'Get One Inversion Opportunity',
    description: 'Get one Inversion Opportunity Detail',
  })
  @UseGuards(AuthGuard(['jwt-token', 'custom-admin-token']))
  @Get(':id')
  async getOne(@Param() { id }: OpportunityParamsDTO) {
    return await this.opportunitiesService.findOneOr404(id);
  }

  @ApiOperation({
    summary: 'User invest in one Inversion Opportunity',
    description:
      'Invest in one Inversion Opportunity, adding a record of User-Opportunity in the pivot table',
  })
  @UseGuards(AuthGuard('jwt-token'))
  @Post('investment/:id')
  async addInvestment(
    @Req() request: requestUser,
    @Param() { id }: OpportunityParamsDTO,
    @Body() { amount }: addInvestmentBodyDTO,
  ) {
    return await this.opportunitiesService.addInvestment(
      request.user.id,
      id,
      amount,
    );
  }

  @ApiOperation({
    summary: 'User drop the Inversion Opportunity',
    description:
      'Drop the Inversion Opportunity, money is return it to the user and the historial prevails about that record',
  })
  @UseGuards(AuthGuard('jwt-token'))
  @Delete('investment/:id')
  async removeInvestment(@Param() { id }: OpportunityParamsDTO) {}
}
