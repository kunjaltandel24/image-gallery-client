import { useCallback, useEffect, useState } from 'react'

import { debounce } from 'lodash'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import Select from 'react-select'

import Header from 'components/common/Header';
import ImageCard from 'components/common/ImageCard'
import Badge from 'components/ui/Badge'
import Image from 'components/ui/Image'
import MultiSelect, { IOptionProps } from 'components/ui/MultiSelect/MultiSelect'
import usePrevious from 'modules/app/hook/usePrevious'
import { setAuthModal } from 'modules/app/slice'
import { isLoggedInSelector, selectUser } from 'modules/auth/slice'
import { IBaseSearchQuery, orderByList, OrderByType } from 'modules/constants'
import { allPublicImages, imageTags } from 'modules/image/api'
import { useAppDispatch, useAppSelector } from 'store/hooks'

const Home: NextPage<IBaseSearchQuery> = ({ q, qTags, qOrderBy }) => {
  const router = useRouter()
  const [listState, setListState] = useState<{
    list: any[]
    total: number | null
  }>({ list: [], total: null })

  let initialTags = qTags || []

  if (typeof qTags === 'string') {
    initialTags = [qTags]
  }

  const dispatch = useAppDispatch()
  const authUser = useAppSelector(selectUser) || {}
  const isLoggedIn = useAppSelector(isLoggedInSelector)
  const [tagsFilter, setTagsFilter] = useState<string[]>(initialTags as string[])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>(q || '')
  const [orderBy, setOrderBy] = useState<OrderByType>(
    orderByList.filter((obl) => obl.queryValue === qOrderBy)[0] || orderByList[0],
  )

  const prevSQ = usePrevious(searchQuery)
  const prevOB = usePrevious(orderBy)
  const prevTags = usePrevious(tagsFilter)

  const fetchPublicImagesByFilters = useCallback(
    async (filterChange?: boolean) => {

      const formData = new FormData()

      if (imageFile) {
        formData.append('image', imageFile)
      }

      const resp = await allPublicImages(
        {
          offset: filterChange ? 0 : listState.list.length,
          limit: 12,
          tags: tagsFilter || undefined,
          searchStr: searchQuery,
          orderBy: orderBy.value,
        },
        formData,
      )
      let list = [...filterChange ? [] : listState.list].concat(resp.data.images)
      setListState({
        list,
        total: resp.data.total,
      })
    },
    [imageFile, tagsFilter, searchQuery, orderBy, listState.list],
  )

  const clearFilters = useCallback(() => {
    setOrderBy(orderByList[0])
    setSearchQuery('')
    setTagsFilter([])
  }, [])

  const updateRouter = useCallback(async () => {
    if (
      prevSQ === searchQuery &&
      prevOB?.queryValue === orderBy.queryValue &&
      JSON.stringify(prevTags) === JSON.stringify(tagsFilter)
    ) {
      return
    }

    const query: any = {
      q: searchQuery,
      orderBy: orderBy.queryValue,
    }
    if (tagsFilter.length) {
      query.tags = tagsFilter
    }
    router
      .replace({
        pathname: router.basePath,
        query,
      })
      .then(() => {
        fetchPublicImagesByFilters(true).catch((e) => console.error('error', (e && e.message) || 'something went wrong!', e))
      })
  }, [
    prevTags,
    tagsFilter,
    router,
    prevSQ,
    searchQuery,
    prevOB,
    orderBy,
    fetchPublicImagesByFilters,
  ])

  const handleSearchInput = debounce(updateRouter, 500)

  const fetchTagsFilterData = useCallback(async () => {
    const resp = await imageTags({ limit: 'all' })
    setTags(resp.data.tags.map((tag: { tagName: string }) => tag.tagName))
  }, [])

  useEffect(() => {
    fetchTagsFilterData().catch((e) => console.error('error', (e && e.message) || 'something went wrong!', e))
  }, [fetchTagsFilterData])

  useEffect(() => {
    handleSearchInput()
  }, [orderBy, tagsFilter])

  useEffect(() => {
    if (imageFile) {
      setImageUrl(URL.createObjectURL(imageFile as Blob))
      fetchPublicImagesByFilters(true)
        .catch((e) => console.error('error', (e && e.message) || 'something went wrong!', e))
    }
  }, [imageFile])

  return (
    <>
      <Header
        showCheckoutBtn={!!selectedImages.length}
        checkoutImages={listState.list.filter((img) => selectedImages.includes(img._id))}
        removeItem={(index: number) => {
          selectedImages.splice(index, 1)
          setSelectedImages([...selectedImages])
        }}
        clearCart={() => {
          setSelectedImages([])
        }}
      />
      <section>
        <div className="bg-gradient-to-t from-white to-gray-50">
          <div className="container">
            <header className="block py-8">
              <div className="h3">
                <span className="mr-2 font-normal">Search result for Images</span>
              </div>
            </header>
            <div className="flex w-full justify-end sm:justify-center">
              {/* Tabs */}
              <div className="mb-3 flex flex-row items-center sm:flex-col sm:w-full">
                {(Boolean(tagsFilter?.length) || orderBy.queryValue !== 'mr' || searchQuery) &&
                  <button type="button" className="mr-4 sm:hidden" onClick={clearFilters}>
                    <Badge title="Clear filters" outline="yellow" rounded/>
                  </button>
                }
                <label
                  htmlFor="profilePicField"
                  className="flex items-center justify-center form-input-explore form-input rounded-full bg-gray-50 mr-2 transition-colors focus:border-gray-100 focus:bg-white sm:text-sm md:text-sm sm:mb-2 md:mr-4 cursor-pointer"
                  data-balloon="Search with image"
                  data-balloon-pos="up"
                  data-balloon-wrap="nowrap"
                >
                  <span className="material-icons-outlined text-xl">add_a_photo</span>
                  <input
                    id="profilePicField"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    className="hidden"
                    placeholder="Upload Image"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </label>
                <div className="input-group input-group-prepend block h-11 w-[380px] sm:w-full">
                  <div>
                    <span className="material-icons-outlined mr-2 text-xl leading-none">search</span>
                  </div>
                  <input
                    type="text"
                    className="form-input-explore form-input w-full rounded-full bg-gray-50 transition-colors focus:border-gray-100 focus:bg-white sm:text-sm md:text-sm"
                    placeholder={'Search images'}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchInput()
                      }
                    }}
                    value={searchQuery || ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="flex items-center pt-6 mb-4 justify-end">
            <div className="hidden sm:flex sm:w-full sm:space-x-3 md:mr-3 md:block">
              <div className="hidden w-full sm:block">
                <MultiSelect
                  instanceId="tag-list"
                  onChange={(tags: IOptionProps[]) => setTagsFilter(tags.map((tag) => tag.value))}
                  values={tagsFilter.map((tag) => ({ label: tag, value: tag }))}
                  options={tags.map((tag) => ({ label: tag, value: tag }))}
                />
              </div>
              <div className="hidden w-full sm:block">
                <Select
                  instanceId="order-list"
                  options={orderByList}
                  onChange={(value) => setOrderBy(value as OrderByType)}
                  value={orderBy}
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="block sm:hidden">
                <MultiSelect
                  instanceId="tag-list-2"
                  onChange={(tags: IOptionProps[]) => setTagsFilter(tags.map((tag) => tag.value))}
                  values={tagsFilter.map((tag) => ({ label: tag, value: tag }))}
                  options={tags.map((tag) => ({ label: tag, value: tag }))}
                />
              </div>
              <div className="block sm:hidden">
                <Select
                  instanceId="order-list-2"
                  options={orderByList}
                  onChange={(value) => setOrderBy(value as OrderByType)}
                  value={orderBy}
                />
              </div>
            </div>
          </div>
          {imageUrl && <div className="flex items-center pt-6 mb-4 justify-center">
            <div
              className="flex flex-col overflow-hidden rounded-2xl items-center border border-gray-100 bg-white transition-all ease-linear hover:-translate-y-1 w-full">
              Searched with Image
              <div className="flex h-[186px] w-full items-center justify-center overflow-hidden">
                <Image src={imageUrl} width={500} height={500} alt="searched-image" className="object-cover"/>
              </div>
            </div>
          </div>}
          <InfiniteScroll
            dataLength={listState.list.length}
            next={() => fetchPublicImagesByFilters()}
            hasMore={listState.total === null || listState.list.length < listState.total}
            loader={<div>loading...</div>}
            className="grid grid-cols-4 gap-6 pt-6 mb-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {listState.list.map((image) => <ImageCard
              showCheckbox={authUser && image.user._id !== authUser._id && !!image.stripeProductId}
              checked={selectedImages.includes(image._id)}
              onCheckboxChange={(checked: boolean) => {
                if (!authUser.isVerified || isLoggedIn) {
                  if (!isLoggedIn) {
                    dispatch(setAuthModal({ authModal: 'login' }))
                  }
                  return
                }
                if (!checked) {
                  const index = selectedImages.indexOf(image._id)
                  selectedImages.splice(index, 1)
                  setSelectedImages([...selectedImages])
                  return
                }
                setSelectedImages([...selectedImages, image._id])
              }}
              className="w-full"
              key={image._id}
              id={image._id}
              url={image.url}
              tags={image.tags}
              user={image.user}
              price={image.price}
              description={image.description}
              checkoutBtn={authUser && image.user._id !== authUser._id && !!image.stripeProductId}
            />)}
          </InfiniteScroll>
        </div>
      </section>
    </>
  )
}

export const getServerSideProps = (props: { query: { [key: string]: string | string[] | any | any[] } }) => {
  const { query } = props
  return {
    props: {
      qTags: query.tags || [],
      q: query.q || '',
      qOrderBy: query.orderBy || 'mr',
    },
  }
}

export default Home
