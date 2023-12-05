import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostModel } from './entities/posts.entity'

// export interface PostModel {
//   id: number
//   author: string
//   title: string
//   content: string
//   likeCount: number
//   commentCount: number
// }

const posts: PostModel[] = [
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
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postReposittory: Repository<PostModel>
  ) {}
  async getAllPosts() {
    const posts = await this.postReposittory.find()
    return posts
  }
  async getPostById(id: number) {
    const post = await this.postReposittory.findOne({
      where: {
        id
      }
    })
    if (!post) {
      throw new NotFoundException()
    }
    return post
  }

  async createPost(author: string, title: string, content: string) {
    const post = this.postReposittory.create({
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0
    })
    const newPost = await this.postReposittory.save(post)
    return newPost
    // return post
  }

  async updatePost(
    id: number,
    author?: string,
    title?: string,
    content?: string
  ) {
    const post = await this.postReposittory.findOne({
      where: {
        id
      }
    })
    if (!post) {
      throw new NotFoundException()
    }
    if (author) {
      post.author = author
    }
    if (title) {
      post.title = title
    }
    if (content) {
      post.content = content
    }

    const newPost = await this.postReposittory.save(post)

    return newPost
  }

  async deletePost(id: number) {
    const post = await this.postReposittory.findOne({
      where: {
        id
      }
    })
    if (!post) {
      throw new NotFoundException()
    }
    await this.postReposittory.delete(post)
    return id
  }
}
