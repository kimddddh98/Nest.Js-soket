import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { PostsService } from './posts.service'

interface PostModel {
  id: number
  author: string
  title: string
  content: string
  likeCount: number
  commentCount: number
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'official',
    title: '제목',
    content: '컨텐츠',
    likeCount: 0,
    commentCount: 0
  },
  {
    id: 2,
    author: 'official',
    title: '2번째',
    content: '오피셜 2번째',
    likeCount: 9999,
    commentCount: 9999
  },
  {
    id: 3,
    author: 'official',
    title: '3번째',
    content: '오피셜 3번째',
    likeCount: 9999,
    commentCount: 9999
  }
]

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get()
  getPosts(): PostModel[] {
    return posts
  }

  @Get(':id')
  getPost(@Param('id') id: string): PostModel {
    const post = posts.find(post => post.id === +id)
    if (!post) {
      throw new NotFoundException()
    }
    return post
  }
  @Post()
  postPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string
  ) {
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0
    }
    posts = [...posts, post]
    return post
  }
  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string
  ) {
    const post = posts.find(post => post.id === +id)
    if (!post) {
      throw new NotFoundException()
    }
    if (author) {
      post.author = author
    }
    if (title) {
      post.title = title
    }
    if (post.content) {
      post.content = content
    }
    posts = posts.map(prePost => (prePost.id === +id ? post : prePost))
    return post
  }
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    posts = posts.filter(post => post.id !== +id)
    return id
  }
}
