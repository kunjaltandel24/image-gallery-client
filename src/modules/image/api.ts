import { get, post } from 'services/axios'

export const allPublicImages = (params: any, body: any = null) => post('images', body, { params })
export const uploadImages = (body: any, config: any = {}) => post('images/upload', body, config)
export const userImages = (id: string, params: any) => get(`images/${id}`, { params })
export const imageDetails = (id: string) => get(`images/details/${id}`)
export const deleteImages = (body: any) => post('images/delete', body)
export const changePermission = (body: any) => post('images/change-permission', body)
export const updateImagePrices = (body: any) => post('images/update-prices', body)
export const generateCheckoutLink = (body: any) => post('images/checkout', body)
export const verifyDiscountCode = (body: any) => post('images/verify-discount-code', body)
export const imageTags = (params: any) => get('images/tags', { params })
