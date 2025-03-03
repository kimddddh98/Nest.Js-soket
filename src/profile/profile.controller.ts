import {
  Body,
  Controller,
  Patch,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'
import { User } from 'src/users/decorator/user.decorator'
import { UsersModel } from 'src/users/entities/users.entity'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ImageType } from 'src/common/entities/image.entity'
import { ProfileImageService } from './image/profile-image.service'
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor'
import { QR } from 'src/common/decorator/query-runner.decorator'
import { QueryRunner } from 'typeorm'

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileImageService: ProfileImageService
  ) {}

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async profileUpdate(
    @User() user: UsersModel,
    @Body() dto: UpdateProfileDto,
    @QR() qr: QueryRunner
  ) {
    const profile = await this.profileService.updateProfile(user, dto, qr)
    console.log(dto.image)
    if (dto.image) {
      await this.profileImageService.createProfileImage(
        {
          type: ImageType.PROFILE,
          path: dto.image,
          profile
        },
        qr
      )
    }

    return profile
  }
}
