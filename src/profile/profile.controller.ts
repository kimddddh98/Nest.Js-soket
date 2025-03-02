import { Body, Controller, Patch, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'
import { User } from 'src/users/decorator/user.decorator'
import { UsersModel } from 'src/users/entities/users.entity'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  profileUpdate(@User() user: UsersModel, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(user, dto)
  }
}
