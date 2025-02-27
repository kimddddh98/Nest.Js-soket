import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostModel } from './entities/posts.entity'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module'
import { CommonModule } from 'src/common/common.module'
import { ImageModel } from 'src/common/entities/image.entity'
import { PostsImagesService } from './images/posts-images.service'
import { LogMiddleware } from 'src/common/middleware/log.middleware'
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
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({
      // path: 'posts',
      /**
       *  * 을 사용하면 posts로 시작하는 모든 경로에 미들웨어를 적용한다.
       */
      path: 'posts*',
      method: RequestMethod.ALL
    })
  }
}
