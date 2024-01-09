import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('me')
  userInfo() {}

  @Get('me/investments')
  myInvestments() {}

  @Post('/balance')
  addBalance() {}
}
