import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'
import { User } from 'src/users/decorator/user.decorator'
import { UsersModel } from 'src/users/entities/users.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'
import { ImageType } from 'src/common/entities/image.entity'
import { DataSource } from 'typeorm'
import { PostsImagesService } from './images/posts-images.service'
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postImagesService: PostsImagesService
  ) {}
  @Get()
  // @UseGuards(AccessTokenGuard)
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.pagenatePosts(query)
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id)
  }

  @Post('testPost')
  @UseGuards(AccessTokenGuard)
  testPost(@User() user: UsersModel, @Body() body: CreatePostDto) {
    return this.postsService.createTestPost(user.id, body)
  }

  // 글작성
  @Post()
  @UseGuards(AccessTokenGuard)
  async postPost(
    @User() user: UsersModel,
    @Body() createPostDto: CreatePostDto
  ) {
    const qr = this.dataSource.createQueryRunner()
    await qr.connect()

    await qr.startTransaction()
    try {
      const userId = user.id
      // 포스트 생성 / 저장
      const post = await this.postsService.createPost(userId, createPostDto, qr)
      // 이미지 생성 / 저장
      for (let i = 0; i < createPostDto.images.length; i++) {
        await this.postImagesService.createPostImage(
          {
            post,
            order: i,
            path: createPostDto.images[i],
            type: ImageType.POST
          },
          qr
        )
      }
      // 모든작업이 완료되면 커밋
      await qr.commitTransaction()
      await qr.release()
      return this.postsService.getPostById(post.id)
    } catch (e) {
      // 에러 발생시 롤백 후 종료
      await qr.rollbackTransaction()
      await qr.release()
      throw new InternalServerErrorException(e)
    }
  }
  // postType: "SIMPLE_REVIEW",
  //       title: title.value.length > 0 ? title.value : null,
  //       content: reviewTxt.value,
  //       userID: "195370793",
  //       rate: rateValue,
  @Post('simple-write')
  postSimple(
    @Body('postType') postType: string,
    @Body('title') title: string | null,
    @Body('content') content: string,
    @Body('userId') userId: string,
    @Body('rate') rate: number,
    @Body('isPrivate') isPrivate: boolean
  ) {
    console.log(postType)
    console.log(title)
    console.log(content)
    console.log(userId)
    console.log(rate)
    console.log(isPrivate)
    return { d: '성공' }
    // return this.postsService.createPost(authorId, title, content)
  }

  // @Post('image')
  // @UseInterceptors(AnyFilesInterceptor())
  // uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   console.log(files)
  //   return { url: join('http://localhost:4000', 'public', files[0].filename) }
  // }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto
  ) {
    return this.postsService.updatePost(id, updatePostDto)
  }
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id)
  }
}
