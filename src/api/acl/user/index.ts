import request from '@/utils/request'
import type { SetRoleDto, SysUserDto, SysUserQueryDto, SysUserVo } from './type'
import type { PageDto, PageVo } from '@/types/type'

/**
 * 获取用户列表
 * @param data 分页参数
 */
export function getUserDataApi(data: PageDto<SysUserQueryDto>) {
  return request<PageVo<SysUserVo>>('/admin/user/page', 'post', data)
}

/**
 * 新增用户
 * @param data 新增用户参数
 */
export function addUserApi(data: SysUserDto) {
  return request<string>('/admin/user/add', 'post', data)
}

/**
 * 编辑用户
 * @param data 编辑用户参数
 */
export function updateUserApi(data: SysUserDto) {
  return request<string>('/admin/user/update', 'post', data)
}

/**
 * 删除用户
 * @param id 用户id
 */
export function delUserApi(id: string) {
  return request('/admin/user/delete', 'post', { id })
}

/**
 * 给用户设置角色
 * @param data 设置角色参数
 */
export function setRoleApi(data: SetRoleDto) {
  return request('/admin/user/setRole', 'post', data)
}
