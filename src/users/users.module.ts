import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModel } from './entities/users.entity'
import { ProfileModel } from 'src/profile/entities/profile.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UsersModel, ProfileModel])],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService]
})
export class UsersModule {}
