type StorageType = 'session' | 'local'
type UseStorageReturnValue = {
    getItem: (key: string, onlyString?: boolean, type?: StorageType) => string
    removeItem: (key: string, type?: StorageType) => void
    setItem: (key: string, data: any, type?: StorageType) => void
}
const storage = (): UseStorageReturnValue => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')()

  return {
    setItem: (key: string, data: any) => {
      if (isBrowser) {
        if (typeof data === 'object') {
          localStorage.setItem(key, JSON.stringify(data))
        } else {
          localStorage.setItem(key, data)
        }
      }
    },
    getItem: (key: string, onlyString?: boolean, type?: StorageType) => {
      const storageType: 'localStorage' | 'sessionStorage' = `${type ?? 'local'}Storage`
      let item: string = isBrowser ? window[storageType][key] : ''
      if (onlyString) {
        return item
      }
      try {
        item = JSON.parse(item)
      } catch (e) {
        return item
      }
      return item
    },
    removeItem: (key: string, type?: StorageType) => {
      const storageType: 'localStorage' | 'sessionStorage' = `${type ?? 'local'}Storage`
      if (isBrowser) {
        window[storageType].removeItem(key)
      }
    }
  }
}

export default storage()
