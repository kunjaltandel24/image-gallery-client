import CheckoutModal from 'components/common/CheckoutModal'
import { useCallback, useEffect, useState } from 'react'

import { NextPage } from 'next'
import { useRouter } from 'next/router'

import NoImage from 'assets/common/no-image.png'
import Header from 'components/common/Header'
import Image from 'components/ui/Image'
import Modal from 'components/ui/Modal'
import PriceSetterForm from 'components/userProfile/PriceSetterForm'
import { selectUser } from 'modules/auth/slice'
import { changePermission, deleteImages, imageDetails as imageDetailsAPI } from 'modules/image/api'
import { useAppSelector } from 'store/hooks'

const ImageDetails: NextPage<{ id: string }> = ({ id }) => {
  const router = useRouter()

  const [imageDetails, setImageDetails] = useState<any>({
    url: NoImage,
    tags: [],
  })
  const [showUserActions, setShowUserActions] = useState<boolean>(false)
  const [checkoutModal, setCheckoutModal] = useState<boolean>(false)
  const authUser = useAppSelector(selectUser) || {}
  const [changePermissionModal, setChangePermissionModal] = useState<boolean>(false)
  const [deleteImageConfirmation, setDeleteImageConfirmation] = useState<boolean>(false)
  const [priceSetterModal, setPriceSetterModal] = useState<boolean>(false)

  const fetchImageDetails = useCallback(async () => {
    const resp = await imageDetailsAPI(id)

    setImageDetails(resp.data)
  }, [id])

  useEffect(() => {
    fetchImageDetails().catch((e) => console.error('error', (e && e.message) || 'something went wrong!', e))
  }, [id])

  useEffect(() => {
    setShowUserActions(imageDetails.user?._id === authUser?._id)
  }, [imageDetails.user?._id, authUser?._id])

  const toggleChangePermissionModal = useCallback(() => {
    setChangePermissionModal(!changePermissionModal)
  }, [changePermissionModal])

  const toggleDeleteImageConfirmation = useCallback(() => {
    setDeleteImageConfirmation(!deleteImageConfirmation)
  }, [deleteImageConfirmation])

  const togglePriceSetterModal = useCallback(() => {
    setPriceSetterModal(!priceSetterModal)
  }, [priceSetterModal])

  const toggleCheckoutModal = useCallback(() => {
    setCheckoutModal(!checkoutModal)
  }, [checkoutModal])

  const deleteImagesNow = async () => {
    deleteImages({ ids: [id] })
      .then(() => {
        setDeleteImageConfirmation(false)
        router.back()
      })
      .catch((error) => console.error('error while deleting images: ', error))
  }

  const changeVisibilityNow = async () => {
    changePermission({ ids: [id], isPublic: !imageDetails.isPublic })
      .then(() => {
        setChangePermissionModal(false)
      })
      .catch((error) => console.error('error while deleting images: ', error))
  }

  return <>
    <Header />
    <section>
      <div className="bg-gradient-to-t from-white to-gray-50">
        <div className="container">
          <div className="flex items-center pt-6 mb-4 justify-center">
            <div className="flex flex-col overflow-hidden rounded-2xl items-center border border-gray-100 bg-white transition-all ease-linear hover:-translate-y-1 w-full">
              <div className="flex items-center justify-between w-full p-5">
                {imageDetails.user?.username && <div className="flex items-center">by: <span className="badge badge-outline-green ml-2 rounded-full">{imageDetails.user?.username}</span></div>}
                {imageDetails.price && <div className="flex items-center">Price: <span className="badge badge-outline-green ml-2 rounded-full">{imageDetails.price} USD</span></div>}
              </div>
              <div className="flex flex-wrap bg-white p-5 sm:p-4 w-full space-x-2 -ml-2">
                {showUserActions && <>
                  <button
                    className="btn btn-sm btn-outline-orange rounded-full"
                    onClick={() => toggleDeleteImageConfirmation()}
                  >
                    Delete Images
                  </button>
                  <button
                    className="btn btn-sm btn-outline-black rounded-full"
                    onClick={() => toggleChangePermissionModal()}
                  >
                    Mark {imageDetails.isPublic ? 'Private' : 'Public'}
                  </button>
                  <button
                    className="btn btn-sm btn-gray rounded-full"
                    onClick={() => togglePriceSetterModal()}
                  >
                    {imageDetails.stripeProductId ? 'Update Price' : 'List for Sell'}
                  </button>
                </>}
                {!showUserActions && imageDetails.stripeProductId && <button
                  className="btn btn-sm btn-default rounded-full"
                  onClick={() => toggleCheckoutModal()}
                >
                  Buy now
                </button>}
              </div>
              <div className="flex h-[800px] w-full items-center justify-center overflow-hidden">
                <Image src={imageDetails.url} width={1000} height={800} alt="searched-image" className="object-cover"/>
              </div>
              <div className="bg-white p-5 sm:p-4 w-full">
                <div className="flex flex-wrap -mb-2">
                  {imageDetails.tags.map((data: any, index: number) => {
                    return (
                      <span
                        key={index}
                        className="badge badge-default mr-2 mb-2 rounded-full"
                      >
                        {data}
                      </span>
                    )
                  })}
                </div>
                {imageDetails.description && <p className="mt-3">{imageDetails.description}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Modal
      title="List for Sell / Update Prices"
      close={() => togglePriceSetterModal()}
      open={priceSetterModal}
      containerClassName="max-h-[564px]"
    >
      <PriceSetterForm
        images={[imageDetails]}
        close={(updateImages: boolean) => {
          togglePriceSetterModal()
          if (updateImages) {
            fetchImageDetails()
              .catch((error) => console.error('image update failed after price changes: ', error))
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
        <p className="mb-5 text-base font-semibold text-gray-700">
          Do you want to mark all selected Images {imageDetails.isPublic ? 'Private' : 'Public'}?
        </p>
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
    <Modal
      open={checkoutModal}
      title={'Checkout'}
      close={() => toggleCheckoutModal()}
    >
      <CheckoutModal
        close={() => toggleCheckoutModal()}
        removeItem={toggleCheckoutModal}
        images={[imageDetails]}
        clearCart={toggleCheckoutModal}
      />
    </Modal>
  </>
}


export const getServerSideProps = (props: { query: { [key: string]: string | string[] | any | any[] } }) => {
  const { query } = props
  return {
    props: {
      id: query.id,
    },
  }
}
export default ImageDetails
