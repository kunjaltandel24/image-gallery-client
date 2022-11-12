import { FC, useState } from 'react'

import clsx from 'clsx'
import { useRouter } from 'next/router'

import Image from 'components/ui/Image'
import { generateCheckoutLink, verifyDiscountCode } from 'modules/image/api'

const CheckoutModal: FC<{
  images: any[]
  close: Function
  removeItem?: Function
  clearCart?: Function
}> = ({ images, close, removeItem, clearCart }) => {
  const router = useRouter()
  const [inProgress, setInProgress] = useState<boolean>(false)
  const [discountCode, setDiscountCode] = useState<string>('')
  const [discountError, setDiscountError] = useState<string | null>(null)
  const [discountApplied, setDiscountApplied] = useState<boolean>(false)
  const [checkoutLink, setCheckoutLink] = useState<string | null>(null)

  const onSubmit = () => {
    setInProgress(true)
    generateCheckoutLink({
      images: images.map((img) => img._id),
      currentUrl: router.asPath,
      discountCode,
    })
      .then((resp) => {
        setInProgress(false)
        setCheckoutLink(resp.data.paymentLink)
      })
      .catch((error) => {
        setInProgress(false)
        setDiscountError(error.message || 'Payment service is not available right now, please try again later!')
        setTimeout(() => {
          setDiscountError(null)
        }, 5000)
      })
  }

  const applyDiscountCode = () => {
    verifyDiscountCode({ discountCode })
      .then((resp) => {
        if (resp.data) {
          setDiscountApplied(true)
        }
      })
      .catch((error) => {
        setDiscountError(error.message || 'discount code is not available')
        setTimeout(() => {
          setDiscountError(null)
        }, 5000)
      })
  }

  return (
    <div className={clsx('px-6 pt-4 pb-6 mx-auto max-w-[618px] block')}>
      <div className="flex items-center mb-3 justify-end">
        <button className="btn btn-outline-orange btn-sm flex items-center justify-center" onClick={() => {
          clearCart && clearCart()
          close()
        }}>
          clear & close <span className="material-icons-outlined">shopping_cart</span>
        </button>
      </div>
      {images.map((field, index) => <div className="mb-3" key={`price-${field._id}`}>
        <div className="flex">
          <div className="p-0.5 min-w-[44px] flex items-center justify-center border border-gray-100 rounded-md mr-2">
            <Image width={40} height={40} className="object-cover rounded-md" alt={field._id} src={field.url} />
          </div>
          <div
            id={`price-${field._id}`}
            className="flex items-center form-input-explore form-input w-full"
          >
            <span className="font-bold">{field.price} USD</span>
          </div>
          <div
            className="h6 inline-flex cursor-pointer items-center rounded-r-lg border border-r-0 border-gray-100 bg-red-50 py-2 px-3 font-normal text-red-600"
            onClick={() => {
              removeItem && removeItem(index)
              if (images.length === 1) {
                close()
              }
            }}
          >
            Remove
          </div>
        </div>
      </div>)}
      <div className="flex">
        <input
          id="discountCode"
          type="text"
          placeholder="Enter Discount Code"
          className="form-input-explore form-input w-full"
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        {discountApplied ? <div
          className="h6 inline-flex cursor-pointer items-center rounded-r-lg border border-r-0 border-gray-100 bg-red-50 py-2 px-3 font-normal text-red-600"
          onClick={applyDiscountCode}
        >Remove</div> : <div
          className="h6 inline-flex cursor-pointer items-center rounded-r-lg border border-r-0 border-gray-100 bg-green-50 py-2 px-3 font-normal text-green-600"
          onClick={() => {
            setDiscountCode('')
            setDiscountApplied(false)
          }}
        >Apply</div>}
        {discountError && <span className="text-sm text-red-500">{discountError}</span>}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-1">
        <div className="col-span-2 sm:col-span-1">
          {checkoutLink ? <a href={checkoutLink} className="btn btn-lg btn-outline-purple w-full">
            Pay now
          </a> : <button
            type="submit"
            className="btn btn-lg btn-black w-full"
            disabled={inProgress}
            onClick={onSubmit}
          >
            Checkout
          </button>}
        </div>
      </div>
    </div>
  )
}

export default CheckoutModal
