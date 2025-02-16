import { Module } from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { RoomsController } from './rooms.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomsModel } from './entities/rooms.entity'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([RoomsModel]), UsersModule, AuthModule],
  controllers: [RoomsController],
  providers: [RoomsService]
})
export class RoomsModule {}
