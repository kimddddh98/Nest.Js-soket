import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'
import { User } from './decorator/user.decorator'
import { UsersModel } from './entities/users.entity'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getUsers(@User() user: UsersModel) {
    return this.usersService.getUsers(user.id)
  }

  @Get('/:id')
  @UseGuards(AccessTokenGuard)
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUser(id)
  }
}
