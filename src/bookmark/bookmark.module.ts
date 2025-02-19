import { Module } from '@nestjs/common'
import { BookmarkService } from './bookmark.service'
import { BookmarkController } from './bookmark.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookmarkModel } from './entities/bookmark.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkModel])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [BookmarkService]
})
export class BookmarkModule {}
