// 定义用户相关数据的ts类型

export type LoginDto = {
  username: string
  password: string
  captcha: string
  codeKey: string
}

export type LoginVo = {
  token: string
  refresh_token: string
}

export type ValidateCodeVo = {
  codeKey: string
  codeValue: string
}

// 定义获取用户信息返回数据类型
export interface userInfoResponseData {
  routes: string[]
  buttons: string[]
  roles: string[]
  name: string
  avatar: string
}
