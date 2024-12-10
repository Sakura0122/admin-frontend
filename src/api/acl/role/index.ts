import request from '@/utils/request'
import type { RoleDto, RoleQueryDto, RoleVo, setMenuDto } from '@/api/acl/role/type'
import type { PageDto, PageVo } from '@/types/type'

/**
 * 获取全部角色
 */
export function getAllRoleDataApi() {
  return request<RoleVo[]>('/admin/role/list')
}

/**
 * 分页获取角色
 * @param data 角色查询条件
 */
export function getRoleDataApi(data: PageDto<RoleQueryDto>) {
  return request<PageVo<RoleVo>>('/admin/role/page', 'post', data)
}

/**
 * 根据id获取角色信息
 * @param id 角色id
 */
export function getRoleByIdApi(id: string) {
  return request<string[]>(`/admin/role/${id}`)
}

/**
 * 新增角色
 * @param data
 */
export function addRoleApi(data: RoleDto) {
  return request<string>('/admin/role/add', 'post', data)
}

/**
 * 编辑角色
 * @param data
 */
export function updateRoleApi(data: RoleDto) {
  return request<string>('/admin/role/update', 'post', data)
}

/**
 * 删除角色
 * @param id 角色id
 */
export function delRoleApi(id: string) {
  return request<any>('/admin/role/delete', 'post', { id })
}

export function setMenuApi(data: setMenuDto) {
  return request('/admin/role/setMenu', 'post', data)
}
