import { FC } from 'react'

import clsx from 'clsx'
import Link from 'next/link'

import Image from 'components/ui/Image'

const ImageCard: FC<{
  id: string
  url: string
  tags: string[]
  className: string
  description?: string
  showCheckbox?: boolean
  checked?: boolean
  onCheckboxChange?: Function
  user?: any
  price?: number
  checkoutBtn?: boolean
}> = (props) => {
  const {
    id, url, description, tags, className,
    showCheckbox, checked, onCheckboxChange,
    user, price, checkoutBtn,
  } = props
  return <div className={clsx(
    'flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all ease-linear hover:-translate-y-1 relative',
    className,
  )}>
    {(showCheckbox || checkoutBtn) && <div className={clsx(
      'absolute top-2 left-2 p-1.5 flex items-center justify-between rounded-md',
      !checkoutBtn && 'bg-gray-400',
    )}>
      {checkoutBtn ? <button
        className="btn btn-gray btn-sm rounded-full"
        onClick={() => {
          onCheckboxChange && onCheckboxChange(!checked)
        }}
      >
        {!checked && <span className="material-icons-outlined text-xl">add_shopping_cart</span>}
        {checked && <span className="material-icons-outlined text-xl">remove_shopping_cart</span>}
      </button> : <label className="checkbox-label m-0 items-start leading-none">
        <input
          type="checkbox"
          className="form-checkbox-explore form-checkbox"
          checked={checked}
          onChange={(e) => {
            onCheckboxChange && onCheckboxChange(e.target.checked)
          }}
        />
      </label>}
    </div>}
    <Link className="flex h-[186px] w-full items-center justify-center overflow-hidden" href={`/image/${id}`}>
      <Image src={url} width={500} height={500} alt={id} className="object-cover"/>
    </Link>
    <div className="bg-white p-5 sm:p-4">
      <div className="flex items-center justify-between">
        {user?.username && <Link href={`/user/${user?.username}`} className="flex items-center mb-3">by: <span className="badge badge-outline-green ml-2 rounded-full">{user?.username}</span></Link>}
        {Boolean(price) && <div className="flex items-center mb-3">Price: <span className="badge badge-outline-green ml-2 rounded-full">{price} USD</span></div>}
      </div>
      <div className="flex flex-wrap -mb-2">
        {tags.map((data: any, index: number) => {
          return (
            <span
              key={index}
              className="badge badge-default mr-2 mb-2 rounded-full"
            >
              {data}
            </span>
          )
        })}
        {description && <p className="mt-3">{description}</p>}
      </div>
    </div>
  </div>
}

export default ImageCard
