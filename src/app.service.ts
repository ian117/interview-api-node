import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'interview-api-ian-v. version@1.0';
  }
}
