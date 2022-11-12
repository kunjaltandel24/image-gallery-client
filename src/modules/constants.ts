
const scheme = process.env.scheme
const host = process.env.host
export const serverUrl = `${scheme}://${host}`;

export type OrderByType = {
  label: string
  queryValue: string
  value: { [key: string]: 1 | -1 }
}

export interface IBaseSearchQuery {
  q?: string
  qTags: string | string[]
  qOrderBy?: 'mr' | 'plh' | 'phl'
}

export const orderByList: OrderByType[] = [{
  label: 'Most Recent',
  queryValue: 'mr',
  value: { createdAt: -1 },
}, {
  label: 'Price Low to High',
  queryValue: 'plh',
  value: { price: 1 },
}, {
  label: 'Price High to Low',
  queryValue: 'phl',
  value: { price: -1 },
}]
