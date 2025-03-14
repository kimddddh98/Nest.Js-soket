import { BadRequestException, Injectable } from '@nestjs/common'
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository
} from 'typeorm'
import { BaseModel } from './entities/base.entity'
import { BasePaginationDto } from './dto/base-pagination.dto'
import { FilterMapper } from './const/filter-mapper.const'
import { ConfigService } from '@nestjs/config'
import { envKeys } from './const/env-keys.const'
import { TEMP_FOLDER_RELATIVE_PATH } from './const/path.const'
import { join } from 'path'

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}
  async paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    findOptions: FindManyOptions<T> = {},
    path: string
  ) {
    if (dto.page) {
      return this.pagePagenate(dto, repository, findOptions)
    } else {
      return this.cursorPagenate(dto, repository, findOptions, path)
    }
  }

  private async pagePagenate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {}
  ) {
    const findOptions = this.composeFindOptions<T>(dto)
    const [result, conut] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions
    })

    return {
      data: result,
      conut: result.length,
      total: conut
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
  private async cursorPagenate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string
  ) {
    const findOptions = this.composeFindOptions<T>(dto)

    const result = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
      where: {
        ...findOptions.where,
        ...overrideFindOptions?.where
      }
    })

    const lastPost =
      result.length > 0 && result.length === dto.take
        ? result[result.length - 1]
        : null
    const nextURL =
      lastPost &&
      new URL(`${this.configService.get<string>(envKeys.BASE_URL)}/${path}`)

    if (nextURL) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextURL.searchParams.append(key, dto[key])
          }
        }
      }

      let key: string

      if (dto.order__createAt === 'ASC') {
        key = 'where__id__more_than'
      }
      if (dto.order__createAt === 'DESC') {
        key = 'where__id__less_than'
      }

      nextURL.searchParams.append(key, lastPost.id.toString())
    }

    return {
      data: result,
      count: result.length,
      cursor: {
        after: lastPost?.id ?? null,
        next: nextURL?.toString() ?? null
      }
    }
  }

  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto
  ): FindManyOptions<T> {
    let where: FindOptionsWhere<T> = {}
    let order: FindOptionsOrder<T> = {}

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhereFilter(key, value)
        }
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseWhereFilter(key, value)
        }
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null
    }
  }
  private parseWhereFilter<T extends BaseModel>(
    key: string,
    value: string
  ): FindOptionsWhere<T> | FindOptionsOrder<T> {
    const options: FindOptionsWhere<T> = {}

    const splitKey = key.split('__')

    if (splitKey.length !== 2 && splitKey.length !== 3) {
      throw new BadRequestException(
        '필터의 값이 잘못되었습니다 문제키 : ' + key
      )
    }

    if (splitKey.length === 2) {
      const [_, filed] = splitKey
      options[filed] = value
    } else {
      const [_, filed, operator] = splitKey

      // 밸류가 두개 이상인 , 로 나눠져 들어오는 경우
      // 예시 : where__name__in=a,b,c, where__id__beetween = 3,4
      // const values = value.split(',')
      // if(values.length >1){
      //   options[filed] =
      // }
      if (operator === 'i_like') {
        options[filed] = FilterMapper[operator](`%${value}%`)
      } else {
        options[filed] = FilterMapper[operator](value)
      }
    }

    return options
  }

  //이미지 업로드

  uploadImage(file: Express.Multer.File) {
    return {
      path: join(TEMP_FOLDER_RELATIVE_PATH, file.filename),
      fileName: file.filename
    }
  }
}
