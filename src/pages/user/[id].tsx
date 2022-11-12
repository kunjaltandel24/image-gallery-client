import { useCallback, useEffect, useState } from 'react'

import { debounce } from 'lodash'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import Select from 'react-select'

import Header from 'components/common/Header';
import ImageCard from 'components/common/ImageCard'
import Badge from 'components/ui/Badge'
import Modal from 'components/ui/Modal'
import MultiSelect, { IOptionProps } from 'components/ui/MultiSelect/MultiSelect'
import PriceSetterForm from 'components/userProfile/PriceSetterForm'
import UploadImageForm from 'components/userProfile/UploadImageModal'
import usePrevious from 'modules/app/hook/usePrevious'
import { setAuthModal } from 'modules/app/slice'
import { isLoggedInSelector, selectUser } from 'modules/auth/slice'
import { IBaseSearchQuery, orderByList, OrderByType } from 'modules/constants'
import { changePermission, deleteImages, imageTags, userImages } from 'modules/image/api'
import { payoutAccountOnboardingLink, payoutAccountVerify } from 'modules/user/api'
import useUserDetails from 'modules/user/hook/useUserDetails'
import { useAppDispatch, useAppSelector } from 'store/hooks'

interface IUserProps extends IBaseSearchQuery {
  userId: string
  q?: string
  qTags: string | string[]
  qOrderBy?: 'mr' | 'plh' | 'phl'
  onb?: string
}

const User: NextPage<IUserProps> = ({ onb: onboarding, userId, q, qTags, qOrderBy }) => {
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

  const { data: { data: userDetails } = { data: {} } } = useUserDetails(userId)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [openUpload, setOpenUpload] = useState<boolean>(false)
  const [priceSetterModal, setPriceSetterModal] = useState<boolean>(false)
  const [visibility, setVisibility] = useState<boolean>(false)
  const [showUserActions, setShowUserActions] = useState<boolean>(false)
  const [payoutOnboardingLink, setPayoutOnboardingLink] = useState<string | null>(null)
  const [onboardingError, setOnboardingError] = useState<string | null>(null)
  const [payoutOnboardingLinkProgress, setPayoutOnboardingLinkProgress] = useState<boolean>(false)
  const [payoutOnboardingLinkError, setPayoutOnboardingLinkError] = useState<string | null>(null)
  const [payoutOnboardingModal, setPayoutOnboardingModal] = useState<boolean>(false)
  const [changePermissionModal, setChangePermissionModal] = useState<boolean>(false)
  const [deleteImageConfirmation, setDeleteImageConfirmation] = useState<boolean>(false)
  const [tagsFilter, setTagsFilter] = useState<string[]>(initialTags as string[])
  const [tags, setTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>(q || '')
  const [orderBy, setOrderBy] = useState<OrderByType>(
    orderByList.filter((obl) => obl.queryValue === qOrderBy)[0] || orderByList[0],
  )

  const prevSQ = usePrevious(searchQuery)
  const prevOB = usePrevious(orderBy)
  const prevTags = usePrevious(tagsFilter)

  const toggleUploadModal = useCallback(() => {
    setOpenUpload(!openUpload)
  }, [openUpload])

  const togglePriceSetterModal = useCallback(() => {
    setPriceSetterModal(!priceSetterModal)
  }, [priceSetterModal])

  const togglePayoutOnboardingModal = useCallback(() => {
    setPayoutOnboardingModal(!payoutOnboardingModal)
  }, [payoutOnboardingModal])

  const toggleChangePermissionModal = useCallback(() => {
    setChangePermissionModal(!changePermissionModal)
  }, [changePermissionModal])

  const toggleDeleteImageConfirmation = useCallback(() => {
    setDeleteImageConfirmation(!deleteImageConfirmation)
  }, [deleteImageConfirmation])

  const fetchUserImages = useCallback(
    async (filterChange?: boolean) => {
      const resp = await userImages(
        userDetails._id,
        {
          offset: filterChange ? 0 : listState.list.length,
          limit: 12,
          tags: tagsFilter || undefined,
          searchStr: searchQuery,
          orderBy: orderBy.value,
        },
      )
      let list = [...filterChange ? [] : listState.list].concat(resp.data.images)
      setListState({
        list,
        total: resp.data.total,
      })
    },
    [userDetails?._id, tagsFilter, searchQuery, orderBy, listState.list],
  )

  const clearFilters = useCallback(() => {
    setOrderBy(orderByList[0])
    setSearchQuery('')
    setTagsFilter([])
  }, [])

  const updateRouter = useCallback(async () => {
    if (
      (
        prevSQ === searchQuery &&
        prevOB?.queryValue === orderBy.queryValue &&
        JSON.stringify(prevTags) === JSON.stringify(tagsFilter)
      ) || !userDetails._id
    ) {
      return
    }

    const query: any = {
      q: searchQuery,
      orderBy: orderBy.queryValue,
      id: userId,
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
        fetchUserImages(true).catch((e) => console.error('error', (e && e.message) || 'something went wrong!', e))
      })
  }, [
    userId,
    prevTags,
    tagsFilter,
    router,
    prevSQ,
    searchQuery,
    prevOB,
    orderBy,
    fetchUserImages,
    userDetails?._id,
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
    if (userDetails?._id) {
      fetchUserImages(true).catch((e) => console.error('error', (e && e.message) || 'something went wrong!', e))
    }
  }, [userDetails?._id])

  useEffect(() => {
    setShowUserActions(userDetails?._id === authUser?._id)
  }, [userDetails?._id, authUser?._id])

  useEffect(() => {
    handleSearchInput()
  }, [orderBy, tagsFilter])

  useEffect(() => {
    if (!onboarding) {
      return
    }
    if (onboarding === 'refreshed') {
      setOnboardingError('You\'ve refreshed in between Onboarding process, Please generate new link and continue from step left behind')
      return
    }
    if (onboarding === 'completed') {
      payoutAccountVerify()
        .catch((e) => console.error('error', (e && e.message) || 'something went wrong! not able to verify payout account', e))
    }
  }, [onboarding])

  const deleteImagesNow = async () => {
    deleteImages({ ids: selectedImages })
      .then(() => {
        fetchUserImages(true)
          .catch((e) => console.error('error', (e && e.message) || 'something went wrong!', e))
        setSelectedImages([])
        setDeleteImageConfirmation(false)
      })
      .catch((error) => console.error('error while deleting images: ', error))
  }

  const changeVisibilityNow = async () => {
    changePermission({ ids: selectedImages, isPublic: visibility })
      .then(() => {
        setSelectedImages([])
        setChangePermissionModal(false)
      })
      .catch((error) => console.error('error while deleting images: ', error))
  }

  const getPayoutOnboradingLink = () => {
    setPayoutOnboardingLinkProgress(true)
    payoutAccountOnboardingLink()
      .then((resp) => {
        const { data: { url } } = resp
        setPayoutOnboardingLink(url)
        setPayoutOnboardingLinkProgress(false)
      })
      .catch((error) => {
        console.error('payout onboarding link generation error: ', error)
        setPayoutOnboardingLinkProgress(false)
        setPayoutOnboardingLinkError(error.message || 'something went wrong!\nnot able to generate payout details link\nPlease try again later')
        setTimeout(() => {
          setPayoutOnboardingLinkError(null)
        }, 5000)
      })
  }

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
      {onboardingError && <div className="w-full bg-yellow-50 p-4 mb-3 text-center rounded-md font-semibold text-yellow-700">
        {onboardingError}&nbsp;
        <span className="text-purple-500 cursor-pointer underline" onClick={() => togglePayoutOnboardingModal()}>
          click here!
        </span>
      </div>}
      <section>
        <div className="bg-gradient-to-t from-white to-gray-50">
          <div className="container">
            <header className="block py-8">
              <div className="h3">
                <span className="mr-2 font-normal">{userDetails.username}&apos;s Images</span>
              </div>
            </header>
            <div className="flex w-full justify-between sm:justify-center mb-3">
              {showUserActions && <>
                <button
                  className="btn btn-sm btn-outline-orange rounded-full"
                  disabled={!authUser.isVerified || !selectedImages.length}
                  onClick={() => toggleDeleteImageConfirmation()}
                >
                  Delete Images
                </button>
                <button
                  className="btn btn-sm btn-outline-black rounded-full"
                  disabled={!authUser.isVerified || !selectedImages.length}
                  onClick={() => toggleChangePermissionModal()}
                >
                  Mark Public/Private
                </button>
                {!authUser.stripeAccountCompleted && <button
                  className="btn btn-sm btn-outline-purple rounded-full"
                  onClick={() => togglePayoutOnboardingModal()}
                  disabled={!authUser.isVerified}
                >
                  Enable Payouts
                </button>}
                <button
                  className="btn btn-sm btn-gray rounded-full"
                  disabled={!authUser.isVerified || !selectedImages.length}
                  onClick={() => togglePriceSetterModal()}
                >
                  Update Price/List for Sell
                </button>
              </>}
            </div>
            <div className="flex w-full justify-between sm:justify-center mb-3">
              {showUserActions && <button
                className="btn btn-sm btn-default rounded-full"
                onClick={() => toggleUploadModal()}
                disabled={!authUser.isVerified}
              >
                Upload Images
              </button>}
              <div className="flex flex-row items-center sm:flex-col sm:w-full">
                {(Boolean(tagsFilter?.length) || orderBy.queryValue !== 'mr' || searchQuery) &&
                  <button type="button" className="mr-4 sm:hidden" onClick={clearFilters}>
                    <Badge title="Clear filters" outline="yellow" rounded/>
                  </button>
                }
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
                  instanceId="tag-list-1"
                  onChange={(tags: IOptionProps[]) => setTagsFilter(tags.map((tag) => tag.value))}
                  values={tagsFilter.map((tag) => ({ label: tag, value: tag }))}
                  options={tags.map((tag) => ({ label: tag, value: tag }))}
                />
              </div>
              <div className="block sm:hidden">
                <Select
                  instanceId="order-list-1"
                  options={orderByList}
                  onChange={(value) => setOrderBy(value as OrderByType)}
                  value={orderBy}
                />
              </div>
            </div>
          </div>
          <InfiniteScroll
            dataLength={listState.list.length}
            next={() => fetchUserImages()}
            hasMore={listState.total === null || listState.list.length < listState.total}
            loader={<div>loading...</div>}
            className="grid grid-cols-4 gap-6 pt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {listState.list.map((image) => <ImageCard
              checkoutBtn={!!image.stripeProductId && !showUserActions}
              showCheckbox={showUserActions}
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
              price={image.price}
              description={image.description}
            />)}
          </InfiniteScroll>
        </div>
      </section>
      <Modal
        title="Upload Images"
        close={() => toggleUploadModal()}
        open={openUpload}
        containerClassName="max-h-[564px]"
      >
        <UploadImageForm close={toggleUploadModal} />
      </Modal>
      <Modal
        title="List for Sell / Update Prices"
        close={() => togglePriceSetterModal()}
        open={priceSetterModal}
        containerClassName="max-h-[564px]"
      >
        <PriceSetterForm
          images={listState.list.filter((img) => selectedImages.includes(img._id))}
          close={(updateImages: boolean) => {
            togglePriceSetterModal()
            if (updateImages) {
              fetchUserImages(true)
                .catch((error) => console.error('image updates failed after price changes: ', error))
            }
          }}
        />
      </Modal>
      <Modal open={deleteImageConfirmation} title={'Confirm Delete'} close={toggleDeleteImageConfirmation}>
        <div className="max-h-[296px] overflow-auto p-5">
          <p className="mb-5 text-base font-semibold text-gray-700">
            Do you want to all selected Images?
          </p>
          <div className="grid w-full grid-cols-2 gap-3">
            <button type="button" className="btn btn-black" onClick={deleteImagesNow}>
              Yes
            </button>
            <button type="button" className="btn btn-default" onClick={() => toggleDeleteImageConfirmation()}>
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal open={changePermissionModal} title={'Change visibility'} close={toggleChangePermissionModal}>
        <div className="max-h-[296px] overflow-auto p-5">
          <div>
            <label className="toggle-label flex items-center">
              <span className="text-sm">Private</span>
              <div className="mx-2">
                <input
                  type="checkbox"
                  className="form-toggle form-toggle-explore"
                  checked={visibility}
                  onChange={(e) => setVisibility(e.target.checked)}
                />
              </div>
              <span className="text-sm">Public</span>
            </label>
          </div>
          <p className="mb-5 text-base font-semibold text-gray-700">
            Do you want to mark all selected Images {visibility ? 'Public' : 'Private'}?
          </p>
          <div className="w-full bg-yellow-50 p-4 text-center font-semibold text-yellow-700">
            <span className="font-bold">Note: </span> it will only change {visibility ? 'Private' : 'Public'} to {visibility ? 'Public' : 'Private'}
            &nbsp;and if any {visibility ? 'Public' : 'Private'} images are selected it won&apos;t affect those image.
          </div>
          <div className="grid w-full grid-cols-2 gap-3">
            <button type="button" className="btn btn-black" onClick={changeVisibilityNow}>
              Yes
            </button>
            <button type="button" className="btn btn-default" onClick={() => toggleChangePermissionModal()}>
              No
            </button>
          </div>
        </div>
      </Modal>
      <Modal open={payoutOnboardingModal} title={'Enable Payouts'} close={togglePayoutOnboardingModal}>
        <div className="max-h-[296px] overflow-auto p-5">
          <p className="mb-5 text-base text-center font-semibold text-gray-700">
            Generate Payout onboarding link
          </p>
          {payoutOnboardingLinkError && <div className="w-full bg-orange-200 p-4 text-center font-semibold text-red-700">
            {payoutOnboardingLinkError}
          </div>}
          <div className="grid w-full grid-cols gap-3">
            {payoutOnboardingLink ? <a href={payoutOnboardingLink} className="btn btn-outline-purple">
              Complete Payout Details
            </a> : <button
              type="button"
              className="btn btn-black"
              onClick={getPayoutOnboradingLink}
              disabled={payoutOnboardingLinkProgress}
            >
              Generate
            </button>}
          </div>
        </div>
      </Modal>
    </>
  )
}

export const getServerSideProps = (props: { query: { [key: string]: string | string[] | any | any[] } }) => {
  const { query } = props
  return {
    props: {
      userId: query.id,
      qTags: query.tags || [],
      q: query.q || '',
      qOrderBy: query.orderBy || 'mr',
      onb: query.onb || '',
    },
  }
}

export default User
