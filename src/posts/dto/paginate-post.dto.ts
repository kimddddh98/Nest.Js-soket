import { IsIn, IsNumber, IsOptional } from 'class-validator'

export class PaginatePostDto {
  /**
   * @description 페이지 번호 // 페이지 값이 있다면 페이지 기반 페이징 함수 실행
   * @default 1
   */
  @IsNumber()
  @IsOptional()
  page?: number

  /**
   * @description 마지막 아이디
   * @default 0
   */
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number = 0

  /**
   * @description 첫번째 아이디
   * @default 0
   */
  @IsNumber()
  @IsOptional()
  where__id_less_than?

  /**
   * @description 정렬 기준
   * @default ASC
   */
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order_createdAt?: 'ASC' | 'DESC' = 'ASC'

  /**
   * @description 조회 개수
   * @default 10
   */
  @IsNumber()
  @IsOptional()
  take?: number = 10
}
