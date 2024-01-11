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
  myInvestments(@Query() paginationQueryDto: PaginationQueryDTO) {}

  @UseGuards(AuthGuard('jwt-token'))
  @Post('/balance')
  addBalance() {}
}
