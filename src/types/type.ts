// 通用分页参数
export type PageDto<T> = {
  currentPage: number
  pageSize: number
  sortField?: string
  isAsc?: boolean
  total?: number
} & T

// 通用分页返回对象
export type PageVo<T> = {
  total: number
  pageCount: number
  list: T[]
}
