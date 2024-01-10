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

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard('jwt-token'))
  @Get('me')
  userInfo(@Req() request) {
    return { hi: 'request' };
  }

  @Get('me/investments')
  myInvestments(@Query() paginationQueryDto: PaginationQueryDTO) {}

  @Post('/balance')
  addBalance() {}
}
