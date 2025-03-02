import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfileModel } from './entities/profile.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProfileModel]), AuthModule, UsersModule],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
