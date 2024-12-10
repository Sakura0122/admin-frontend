// 菜单数据与按钮数据的ts类型

export type MenuVo = {
  id: string
  title: string
  component: string
  type: number
  status: string
  sortValue: number
  children: MenuVo[]
  createTime: string
  updateTime: string
}

export type MenuDto = {
  id?: string
  parentId: string
  title: string
  component: string
  type: number
  sortValue: number
  status: number
}
