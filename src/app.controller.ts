import {
  Controller,
  Get,
  Post,
  UnauthorizedException,
  Headers
} from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return 'Hello World!'
  }
  @Post('/deactivate')
  deactivateAccount(@Headers('Authorization') token: string) {
    console.log(token.split(' ')[1] === 'undefined')
    if (!token || token.split(' ')[1] === 'undefined') {
      throw new UnauthorizedException()
    }
    return {
      message: 'Deactivated'
    }
  }
}
