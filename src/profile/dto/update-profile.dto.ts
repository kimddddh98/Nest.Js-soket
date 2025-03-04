import { PartialType, PickType } from '@nestjs/mapped-types'
import { ProfileModel, ProfilePublicType } from '../entities/profile.entity'
import { IsEnum, IsOptional, IsString, Length } from 'class-validator'

export class UpdateProfileDto extends PickType(ProfileModel, [
  'nickname',
  'publicType'
]) {
  @IsString()
  @IsOptional()
  @Length(1, 20)
  nickname: string

  @IsString()
  @IsOptional()
  image: string

  @IsEnum(ProfilePublicType)
  @IsOptional()
  publicType: ProfilePublicType
}
