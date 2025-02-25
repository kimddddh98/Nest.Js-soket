import { BadRequestException, Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostModel } from './entities/posts.entity'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module'
import { CommonModule } from 'src/common/common.module'
import { MulterModule } from '@nestjs/platform-express'
import { extname } from 'path'
import * as multer from 'multer'
import { POST_UPLOAD_FOLDER_PATH } from 'src/common/const/path.const'
import { v4 } from 'uuid'
@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel]),
    UsersModule,
    AuthModule,
    CommonModule,
    MulterModule.register({
      limits: {
        fileSize: 10000000
      },
      /**
       * cb(null, true) will accept the file
       * cb(null, false) will reject the file
       * cb(new Error('message')) will reject the file with a message
       *
       * cb 의 첫번째 파라미터에는 에러가 있을 경우 에러를 넣어주고
       * 두번째 파라미터에는 boolean 값을 넣어준다.
       * true 는 파일을 받아들이고 false 는 파일을 거부한다.
       */
      fileFilter: (req, file, cb) => {
        const filename = file.originalname
        const ext = extname(filename)
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('이미지 파일만 업로드 가능합니다.'),
            false
          )
        }
        cb(null, true)
      },
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, POST_UPLOAD_FOLDER_PATH)
        },
        filename: (req, file, cb) => {
          cb(null, `${v4()}${extname(file.originalname)}`)
        }
      })
    })
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
