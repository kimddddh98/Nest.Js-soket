import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostsModule } from './posts/posts.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostModel } from './posts/entities/posts.entity'
import { UsersModule } from './users/users.module'
import { UsersModel } from './users/entities/users.entity'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { RoomsModule } from './rooms/rooms.module'
import { RoomsModel } from './rooms/entities/rooms.entity'
import { BookmarkModule } from './bookmark/bookmark.module'
import { BookmarkModel } from './bookmark/entities/bookmark.entity'
import { ConfigModule } from '@nestjs/config'
import {
  PUBLIC_FOLDER_NAME,
  PUBLIC_FOLDER_PATH
} from './common/const/path.const'
@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [PostModel, UsersModel, RoomsModel, BookmarkModel],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    CommonModule,
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_NAME,
      /**
          rootPath 가 제외되어 보이게 되면 posts 로 업로드 할 경우
          posts/image.jpg 로 접근이 가능한데 posts 컨트롤러가 존재하기떄문에 serveRoot를 설정
       */
      serveRoot: '/public'
    }),
    RoomsModule,
    BookmarkModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})
export class AppModule {}
