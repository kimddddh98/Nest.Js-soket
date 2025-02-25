import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm'
import { PostModel } from './entities/posts.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'
import { URL } from 'url'
import { CommonService } from 'src/common/common.service'
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
    private readonly postReposittory: Repository<PostModel>,
    private readonly commonService: CommonService
  ) {}
  async getAllPosts() {
    const posts = await this.postReposittory.find({
      relations: {
        author: true
      }
    })
    return posts
  }

  async pagenatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.postReposittory,
      {
        relations: {
          author: true
        }
      },
      'posts'
    )
    // if (dto.page) {
    //   return this.pagePagenatePosts(dto)
    // } else {
    //   return this.corsorPagenatePosts(dto)
    // }
  }

  /**
   * RESPONSE 형식
   * {
   *  data: PostModel[]
   *  count: number
   *  cursor :{
   *    마지막 응답 데이터의 id
   *    after: number
   *   }
   *   다음페이지에 조회활 url
   *   next :  string
   * }
   */

  async createTestPost(authorId: number, body: CreatePostDto) {
    const { title, content } = body
    for (let i = 0; i < 10; i++) {
      await this.createPost(authorId, {
        title: title + i,
        content: content + i
      })
    }
    return {
      message: 'test post created'
    }
  }

  // }
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

  async createPost(authorId: number, postDto: CreatePostDto, image?: string) {
    const post = this.postReposittory.create({
      author: {
        id: authorId
      },
      ...postDto,
      image,
      likeCount: 0,
      commentCount: 0
    })
    const newPost = await this.postReposittory.save(post)
    return newPost
    // return post
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    const { title, content } = updatePostDto
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
    await this.postReposittory.delete(id)
    return id
  }
}
