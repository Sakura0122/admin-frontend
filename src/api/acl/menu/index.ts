import request from '@/utils/request'
import type { MenuDto, MenuVo } from '@/api/acl/menu/type'

/**
 * 获取全部菜单与按钮的标识数据
 */
export function getAllMenuApi() {
  return request<MenuVo[]>('/admin/menu/list')
}

/**
 * 根据角色id获取菜单id集合
 * @param id 角色id
 */
export function getMenuByRoleIdApi(id: string) {
  return request<string[]>(`/admin/menu/role/${id}`)
}

/**
 * 新增菜单
 * @param data 菜单数据
 */
export function addMenuApi(data: MenuDto) {
  return request<string>('/admin/menu/add', 'post', data)
}

/**
 * 修改菜单
 * @param data 菜单数据
 */
export function updateMenuApi(data: MenuDto) {
  return request<any>('/admin/menu/update', 'post', data)
}

/**
 * 删除菜单
 * @param id 菜单id
 */
export function delMenuApi(id: string) {
  return request<any>('/admin/menu/delete', 'post', { id })
}
