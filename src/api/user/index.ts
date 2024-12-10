import request from '@/utils/request'
import type {
  LoginDto,
  LoginVo,
  SysUserDto,
  SysUserQueryDto,
  SysUserVo,
  userInfoResponseData,
  ValidateCodeVo
} from './type'
import type { PageDto, PageVo } from '@/types/type'

/**
 * 登录
 * @param data 账号密码
 */
export function loginApi(data: LoginDto) {
  return request<LoginVo>('admin/user/login', 'post', data)
}

/**
 * 获取验证码
 */
export function getCodeApi() {
  return request<ValidateCodeVo>('/admin/user/validateCode')
}

/**
 * 获取用户信息
 */
export function getUserInfoApi() {
  return request<userInfoResponseData>('/admin/user/info')
}

/**
 * 退出登录
 */
export function logoutApi() {
  return request<any>('/admin/user/logout')
}
