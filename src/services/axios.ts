import axios, { AxiosInstance } from 'axios'

import { serverUrl } from 'modules/constants'
import storage from 'services/storage'

const instance: AxiosInstance = axios.create({
  baseURL: `${serverUrl}/api/`
})

instance.interceptors.request.use(
  (config) => {
    const token: string = storage.getItem('auth.token')
    if (token) {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers['token'] = token
      config.headers['served-url'] = window?.location?.pathname
    }
    return config
  },
  error => Promise.reject(error.response)
)

instance.interceptors.response.use(response => response, error => {
  const { response: { status } } = error
  if (status === 401) {
    localStorage.removeItem('token')
  }
  return Promise.reject(error.response)
})



export function get(url: string, params?: any) {
  return instance.get(url, params)
    .then(({ data }) => data)
    .catch(({ response }) => Promise.reject(response && response.data ? response.data : response))
}

export function post(url: string, payload?: any, params?: any) {
  return instance.post(url, payload, params)
    .then(({ data }) => data)
    .catch(({ response }) => Promise.reject(response && response.data ? response.data : response))
}

export function put(url: string, payload?: any, options?: any) {
  return instance.put(url, payload, options)
    .then(({ data }) => data)
    .catch(({ response }) => Promise.reject(response && response.data ? response.data : response))
}

export function deleteRequest(url: string, options?: any) {
  return instance.delete(url, options)
    .then(({ data }) => data)
    .catch(({ response }) => Promise.reject(response && response.data ? response.data : response))
}
