import {
  Body,
  Controller,
  Delete,
  Get,
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
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
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

  @Post()
  @UseGuards(AccessTokenGuard)
  postPost(@User() user: UsersModel, @Body() createPostDto: CreatePostDto) {
    const authorId = user.id
    return this.postsService.createPost(authorId, createPostDto)
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
