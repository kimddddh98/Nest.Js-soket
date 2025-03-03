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
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'
import { User } from 'src/users/decorator/user.decorator'
import { UsersModel } from 'src/users/entities/users.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'
import { ImageType } from 'src/common/entities/image.entity'
import { DataSource, QueryRunner } from 'typeorm'
import { PostsImagesService } from './images/posts-images.service'
import { LogInterceptor } from 'src/common/interceptor/log.interceptor'
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor'
import { QR } from 'src/common/decorator/query-runner.decorator'
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception.filter'
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postImagesService: PostsImagesService
  ) {}
  @Get()
  // @UseGuards(AccessTokenGuard)
  @UseInterceptors(LogInterceptor)
  @UseFilters(HttpExceptionFilter)
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
  @UseInterceptors(TransactionInterceptor)
  async postPost(
    @User() user: UsersModel,
    @Body() createPostDto: CreatePostDto,
    @QR() qr: QueryRunner
  ) {
    const userId = user.id

    // 포스트 생성 / 저장
    const post = await this.postsService.createPost(userId, createPostDto, qr)

    // 이미지 생성 / 저장
    for (let i = 0; i < createPostDto.images.length; i++) {
      /**
       * @TODO
       * 만약 이미지를 루핑하다 성공한 이미지와 실패한 이미지가있다면 어떻게 처리할것인가?
       */
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
    return this.postsService.getPostById(post.id, qr)
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
