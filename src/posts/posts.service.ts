import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryRunner, Repository } from 'typeorm'
import { PostModel } from './entities/posts.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PaginatePostDto } from './dto/paginate-post.dto'
import { CommonService } from 'src/common/common.service'
import { promises } from 'fs'
import { basename, join } from 'path'
import {
  POST_UPLOAD_FOLDER_PATH,
  TEMP_FOLDER_PATH
} from 'src/common/const/path.const'
import { CreatePostImageDto } from './dto/image/create-post-image.dto'
import { ImageModel } from 'src/common/entities/image.entity'
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options.const'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postReposittory: Repository<PostModel>,
    private readonly commonService: CommonService,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(PostModel) : this.postReposittory
  }

  async getAllPosts() {
    const posts = await this.postReposittory.find({
      ...DEFAULT_POST_FIND_OPTIONS
    })
    return posts
  }

  async pagenatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.postReposittory,
      {
        ...DEFAULT_POST_FIND_OPTIONS
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
      ...DEFAULT_POST_FIND_OPTIONS,
      where: {
        id
      }
    })
    if (!post) {
      throw new NotFoundException()
    }
    return post
  }

  async createPost(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr)
    const post = repository.create({
      author: {
        id: authorId
      },
      ...postDto,
      images: [],
      likeCount: 0,
      commentCount: 0
    })
    const newPost = await repository.save(post)
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

  // async createPostImage(dto: CreatePostImageDto) {
  //   const tempFilePath = join(TEMP_FOLDER_PATH, dto.path)

  //   try {
  //     await promises.access(tempFilePath)
  //   } catch (e) {
  //     throw new BadRequestException('파일이 존재하지 않습니다.')
  //   }

  //   const fileName = basename(tempFilePath)

  //   const newFilePath = join(POST_UPLOAD_FOLDER_PATH, fileName)

  //   const result = await this.imageRepository.save({
  //     ...dto
  //   })
  //   await promises.rename(tempFilePath, newFilePath)

  //   return result
  // }
}
