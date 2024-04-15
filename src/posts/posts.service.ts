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

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postReposittory: Repository<PostModel>
  ) {}
  async getAllPosts() {
    const posts = await this.postReposittory.find({
      relations: {
        author: true
      }
    })
    return posts
  }
  async getPostById(id: number) {
    const post = await this.postReposittory.findOne({
      where: {
        id
      },
      relations: ['author']
    })
    if (!post) {
      throw new NotFoundException()
    }
    return post
  }

  async createPost(authorId: number, title: string, content: string) {
    const post = this.postReposittory.create({
      author: {
        id: authorId
      },
      title,
      content,
      likeCount: 0,
      commentCount: 0
    })
    const newPost = await this.postReposittory.save(post)
    return newPost
    // return post
  }

  async updatePost(id: number, title?: string, content?: string) {
    const post = await this.postReposittory.findOne({
      where: {
        id
      }
    })
    if (!post) {
      throw new NotFoundException()
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
