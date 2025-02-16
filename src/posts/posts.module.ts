import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostModel } from './entities/posts.entity'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module'
@Module({
  imports: [TypeOrmModule.forFeature([PostModel]), UsersModule, AuthModule],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
