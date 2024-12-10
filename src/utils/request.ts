import axios from 'axios'
import type { Method, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { hideLoading, showLoading } from './loading'
import useUserStore from '@/stores/modules/user'

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000
})

service.interceptors.request.use(
  (config) => {
    showLoading()
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res) => {
    hideLoading()
    if (res.data.code === 200) {
      return res.data
    } else if (res.data.code === 208) {
      ElMessage.error(res.data.message || '登录过期，请重新登录')
      useUserStore().userLogout()
      return Promise.reject(res.data)
    } else {
      ElMessage.error(res.data.message || '网络异常')
      return Promise.reject(res.data)
    }
  },
  (error) => {
    hideLoading()
    const errorMessages: { [key: number]: string } = {
      400: '请求错误',
      401: 'TOKEN过期',
      403: '拒绝访问',
      404: '请求地址出错',
      408: '请求超时',
      500: '服务器内部错误',
      501: '服务未实现',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时',
      505: 'HTTP 版本不受支持'
    }
    const status: number = error.response.status
    const message: string = errorMessages[status] || '请求错误'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

type Data<T> = {
  code: string
  data: T
  message: string
}

const request = <T>(url: string, method: Method = 'get', submitData?: object, config?: AxiosRequestConfig) => {
  return service.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
    ...config
  })
}

export default request
