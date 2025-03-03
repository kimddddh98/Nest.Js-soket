import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfileModel } from './entities/profile.entity'
import { ImageModel } from 'src/common/entities/image.entity'
import { ProfileImageService } from './image/profile-image.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileModel, ImageModel]),
    AuthModule,
    UsersModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileImageService]
})
export class ProfileModule {}
