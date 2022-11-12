import { post } from 'services/axios'

export const login = (body: any) => post('auth/login', body)
export const register = (body: any) => post('auth/register', body)
export const verify = (body: any) => post('auth/verify', body)
