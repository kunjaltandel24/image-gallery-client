import { FC, useState } from 'react'

import clsx from 'clsx'
import { useFieldArray, useForm } from 'react-hook-form'

import Image from 'components/ui/Image'
import { updateImagePrices } from 'modules/image/api'

type Price = {
  id: string
  url: string
  price: number
}

type FormValues = { prices: Price[] }

const PriceSetterForm: FC<{
  images: any[]
  close: Function
}> = ({ images, close }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      prices: images.map((img) => ({
        url: img.url,
        id: img._id,
        price: img.price || 0,
      }))
    },
  })
  const { fields, remove } = useFieldArray({
    control,
    name: 'prices',
  })
  const watchFieldArray = watch('prices');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    }
  })

  const [inProgress, setInProgress] = useState<boolean>(false)

  const onSubmit = (data: any) => {
    setInProgress(true)
    updateImagePrices(data)
      .then(() => {
        setInProgress(false)
        close(true)
      })
      .catch((error) => {
        setInProgress(false)
        console.error('image price changes failed: ', error)
      })
  }

  return (
    <form className={clsx('px-6 pt-4 pb-6 mx-auto max-w-[618px] block')} onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full bg-yellow-50 p-4 mb-3 rounded-md font-semibold text-yellow-700">
        <span className="font-bold">Note: </span> Currency will be USD only. <br/>
        Minimum Price of image should be <span className="font-bold">0.5 USD</span>
      </div>
      {controlledFields.map((field, index) => <div className="mb-3" key={`price-${field.id}`}>
        <div className="flex">
          <div className="p-0.5 min-w-[44px] flex items-center justify-center border border-gray-100 rounded-md mr-2">
            <Image width={40} height={40} className="object-cover rounded-md" alt={field.id} src={field.url} />
          </div>
          <input
            id={`price-${field.id}`}
            type="number"
            placeholder="Set Price for Image"
            className="form-input-explore form-input w-full"
            {...register(`prices.${index}.price`, {
              required: true,
              validate: (value) => (
                (!value || !Number(value || Number(value) < 0.5)) &&
                'Please enter valid price'
              ) || true,
            })}
          />
          {index > 0 && <div
            className="h6 inline-flex cursor-pointer items-center rounded-r-lg border border-r-0 border-gray-100 bg-red-50 py-2 px-3 font-normal text-red-600"
            onClick={() => {
              remove(index)
            }}
          >
            Remove
          </div>}
        </div>
        {errors.prices?.[index]?.price && <span className="text-sm text-red-500">{errors.prices?.[index]?.price?.message || 'price is required for sell list'}</span>}
      </div>)}
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-1">
        <div className="col-span-2 sm:col-span-1">
          <button
            type="submit"
            className="btn btn-lg btn-black w-full"
            disabled={inProgress}
          >
            Update Prices
          </button>
        </div>
      </div>
    </form>
  )
}

export default PriceSetterForm
