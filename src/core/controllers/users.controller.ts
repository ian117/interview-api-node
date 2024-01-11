import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationQueryDTO } from '../dtos/pagination.dto';
import { Users } from '../models/users.model';
import { UsersService } from '../services/users.service';
import { requestUser } from 'src/common/interfaces/common.interface';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserMe } from '../responses-types/user.responses';
import { getPagination, getPagingData } from '../helpers/paginations';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Returns Information about the user autenticated and his wallet',
    description: 'Returns user object with Wallet',
  })
  @ApiOkResponse({
    type: GetUserMe,
  })
  @UseGuards(AuthGuard('jwt-token'))
  @Get('me')
  async userInfo(@Req() request: requestUser) {
    return await this.usersService.meUser(request.user.id);
  }

  @UseGuards(AuthGuard('jwt-token'))
  @Get('me/investments')
  async myInvestments(
    @Req() request: requestUser,
    @Query() query: PaginationQueryDTO,
  ) {
    const { page, size } = query;
    const { limit, offset } = getPagination(page, size);
    query.limit = limit;
    query.offset = offset;
    const opportunities = await this.usersService.userBalances(
      request.user.id,
      query,
    );
    const results = getPagingData(opportunities, page, limit);
    return results;
  }

  @ApiOperation({
    summary: 'Add 1,000 MXN to your account',
    description: 'Add 1,000 MXN to your Wallet',
  })
  @UseGuards(AuthGuard('jwt-token'))
  @Post('/balance')
  async addBalance(@Req() request: requestUser) {
    await this.usersService.addMoneyToBalance(request.user.id, 1000);
    return {
      message:
        'Se procesado el movimiento en Stripe, y se han agregado 1,000 MXN a su cuenta',
    };
  }
}
