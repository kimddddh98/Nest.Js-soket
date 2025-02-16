import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm'
import { PostModel } from './entities/posts.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'
import { URL } from 'url'
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

  async pagenatePosts(query: PaginatePostDto) {
    if (query.page) {
      return this.pagePagenatePosts(query)
    } else {
      return this.corsorPagenatePosts(query)
    }
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
  async pagePagenatePosts(query: PaginatePostDto) {
    const { page, order_createdAt, take } = query

    const [posts, totalCount] = await this.postReposittory.findAndCount({
      skip: take * (page - 1),
      take,
      order: {
        createAt: order_createdAt
      }
    })

    return {
      data: posts,
      count: posts.length,
      total: totalCount
    }
  }

  async corsorPagenatePosts(query: PaginatePostDto) {
    const { where__id_more_than, where__id_less_than, order_createdAt, take } =
      query

    const where: FindOptionsWhere<PostModel> = {}

    if (where__id_less_than) {
      where.id = LessThan(where__id_less_than)
    } else {
      where.id = MoreThan(where__id_more_than)
    }

    console.log('where__id_more_than', where__id_more_than)
    const posts = await this.postReposittory.find({
      where,
      order: {
        createAt: order_createdAt
      },
      take
    })

    const lastPost =
      posts.length > 0 && posts.length === take ? posts[posts.length - 1] : null
    const nextURL = lastPost && new URL('http://localhost:4000/posts')

    if (nextURL) {
      for (const key of Object.keys(query)) {
        if (query[key]) {
          if (key !== 'where__id_more_than' && key !== 'where__id_less_than') {
            nextURL.searchParams.append(key, query[key])
          }
        }
      }

      let key: string

      if (order_createdAt === 'ASC') {
        key = 'where__id_more_than'
      }
      if (order_createdAt === 'DESC') {
        key = 'where__id_less_than'
      }

      nextURL.searchParams.append(key, lastPost.id.toString())
    }

    return {
      data: posts,
      count: posts.length,
      cursor: {
        after: lastPost?.id
      },
      next: nextURL?.toString()
    }
  }

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

  async createPost(authorId: number, postDto: CreatePostDto) {
    const post = this.postReposittory.create({
      author: {
        id: authorId
      },
      ...postDto,
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
    await this.postReposittory.delete(post)
    return id
  }
}
