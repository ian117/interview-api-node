import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard('jwt-token'))
  @Get('me')
  userInfo(@Req() request) {
    return { hi: 'request' };
  }

  @Get('me/investments')
  myInvestments() {}

  @Post('/balance')
  addBalance() {}
}
