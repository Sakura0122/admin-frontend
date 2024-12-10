export type RoleQueryDto = {
  roleName: string
}

export type RoleVo = {
  id: string
  roleName: string
  roleCode: string
  description: string
  createTime: string
  updateTime: string
}

export type RoleDto = {
  id?: string
  roleName: string
  roleCode: string
  description: string
}

export type setMenuDto = {
  roleId: string
  menuIdList: string[]
}
