import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getUsers() {
    return this.usersService.getUsers()
  }

  @Get('/:id')
  @UseGuards(AccessTokenGuard)
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUser(id)
  }
}
