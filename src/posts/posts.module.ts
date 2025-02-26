import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostModel } from './entities/posts.entity'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module'
import { CommonModule } from 'src/common/common.module'
import { ImageModel } from 'src/common/entities/image.entity'
import { PostsImagesService } from './images/posts-images.service'
@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel, ImageModel]),
    UsersModule,
    AuthModule,
    CommonModule
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsImagesService]
})
export class PostsModule {}
