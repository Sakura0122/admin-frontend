import { reactive, watch } from 'vue'

export type DefaultPaginationData = {
  total: number
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
}

/** 默认的分页参数 */
const defaultPaginationData: DefaultPaginationData = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 50, 100],
  pageSize: 10,
  layout: 'total, prev, pager, next, sizes'
}

const usePagination = (callback: () => void, initialPaginationData?: Partial<DefaultPaginationData>) => {
  const pagination = reactive({
    ...defaultPaginationData,
    ...initialPaginationData,
    search: () => (pagination.currentPage === 1 ? callback() : (pagination.currentPage = 1))
  })

  watch(
    () => pagination.currentPage,
    () => callback()
  )
  watch(
    () => pagination.pageSize,
    () => pagination.search()
  )

  return { pagination }
}

export default usePagination
