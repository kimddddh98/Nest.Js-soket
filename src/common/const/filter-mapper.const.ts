import {
  Any,
  ArrayContains,
  ArrayContainedBy,
  ArrayOverlap,
  Between,
  Equal,
  In,
  ILike,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not
} from 'typeorm'

export const FilterMapper = {
  any: Any,
  array_contains: ArrayContains,
  array_contained_by: ArrayContainedBy,
  array_overlap: ArrayOverlap,
  between: Between,
  equal: Equal,
  in: In,
  i_like: ILike,
  is_null: IsNull,
  less_than: LessThan,
  less_than_or_equal: LessThanOrEqual,
  like: Like,
  more_than: MoreThan,
  more_than_or_equal: MoreThanOrEqual,
  not: Not
}
