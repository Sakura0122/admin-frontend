import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { getToken, removeToken, setToken } from '@/utils/token'
import type { LoginDto } from '@/api/user/type'
import { getUserInfoApi, loginApi, logoutApi } from '@/api/user'
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'

// 过滤当前用户需要的异步路由
function filterAsyncRoute(asyncRoute: RouteRecordRaw[], route: string[]) {
  const result = []
  const routeSet = new Set(route)
  for (const item of asyncRoute) {
    if (routeSet.has(item.name as string)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, route)
      }
      result.push(item)
    }
  }
  return result
}

const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const menuRoutes = ref<RouteRecordRaw[]>(constantRoute) as Ref<RouteRecordRaw[]>
  const avatar = ref('')
  const username = ref('')
  const buttons = ref<string[]>([])

  const userLogin = async (data: LoginDto) => {
    const res = await loginApi(data)
    token.value = res.data.token
    setToken(res.data.token)
  }

  const userInfo = async () => {
    const res = await getUserInfoApi()

    const userAsyncRoute = filterAsyncRoute(asyncRoute, res.data.routes)
    menuRoutes.value = [...constantRoute, ...userAsyncRoute, anyRoute]
    ;[...userAsyncRoute, anyRoute].forEach((route) => {
      router.addRoute(route)
    })

    avatar.value = res.data.avatar
    username.value = res.data.name
    buttons.value = res.data.buttons
  }

  const userLogout = async () => {
    await logoutApi()
    token.value = ''
    username.value = ''
    avatar.value = ''
    menuRoutes.value = constantRoute
    removeToken()
    router.push('/login')
  }

  return { token, menuRoutes, avatar, username, buttons, userLogin, userInfo, userLogout }
})

export default useUserStore
