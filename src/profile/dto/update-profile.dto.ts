import { PartialType, PickType } from '@nestjs/mapped-types'
import { ProfileModel } from '../entities/profile.entity'
import { IsOptional, IsString, Length } from 'class-validator'

export class UpdateProfileDto extends PickType(ProfileModel, [
  'nickname',
  'profileImg'
]) {
  @IsString()
  @IsOptional()
  @Length(1, 20)
  nickname: string
}
