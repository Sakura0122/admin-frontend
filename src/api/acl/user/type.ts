export type SysUserQueryDto = {
  keywords?: string
  status?: number
  createTimeBegin?: string
  createTimeEnd?: string
}

export type SysUserVo = {
  id: string
  username: string
  name: string
  phone: string
  avatar: string
  status?: number
  description: string
  createTime: string
  updateTime: string
}

export type SysUserDto = {
  id?: string
  username: string
  password: string
  name: string
  phone: string
  avatar: string
  status: number
  description: string
}

export type SetRoleDto = {
  userId: string
  roleIdList: string[]
}
