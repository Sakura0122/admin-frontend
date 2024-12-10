import request from '@/utils/request'

/**
 * 上传
 * @param data 文件
 */
export function uploadApi(data: File) {
  const formData = new FormData()
  formData.append('file', data)
  return request<string>('/admin/upload', 'post', formData)
}
