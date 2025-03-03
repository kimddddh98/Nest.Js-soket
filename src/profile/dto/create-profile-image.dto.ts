import { PickType } from '@nestjs/mapped-types'
import { ImageModel } from 'src/common/entities/image.entity'

export class CreateProfileImageDto extends PickType(ImageModel, [
  'path',
  'type',
  'profile'
]) {}
