import { FC, useCallback, useEffect, useState } from 'react'

import clsx from 'clsx'
import { Controller, useForm } from 'react-hook-form'

import { CloseIcon, CloudUploadIcon } from 'assets/icons'
import Dropzone from 'components/ui/Dropzone'
import Image from 'components/ui/Image'
import MultiSelect from 'components/ui/MultiSelect/MultiSelect'
import { imageTags, uploadImages } from 'modules/image/api'

const UploadImageForm: FC<{ close: Function }> = ({ close }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<{ images: any[] | File[]; description?: string; tags: string[] }>({
    defaultValues: {
      images: [],
      tags: [],
    },
  })

  const [inProgress, setInProgress] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])

  const onSubmit = (data: any) => {
    const failedImagesIndex: number[] = []
    const _promise = []

    setInProgress(true)
    for (let index = 0; index < data.images.length; index += 1) {
      const formData = new FormData()
      formData.append('description', data.description)
      data.tags.map((tag: string, i: number) => formData.append(`tags[${i}]`, tag))
      formData.append('images', data.images[index])
      _promise.push(uploadImages(formData, {
        onUploadProgress: (progressEvent: any) => {
          uploadProgress[index] = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress([...uploadProgress])
        },
      })
        .catch(() => failedImagesIndex.push(index)))
    }

    Promise.allSettled(_promise)
      .then(() => {
        if (failedImagesIndex.length) {
          setApiError('failed to upload some images which still in form and all uploaded images are removed from selection.')
          const newImages: (File | any)[] = []
          for (let i = 0; i < data.images.length; i += 1) {
            if (failedImagesIndex.includes(i)) {
              newImages.push(data.images[i])
            }
          }
          setValue('images', newImages)
          return
        }
        reset()
        close()
      })
      .catch((error) => console.error('error in upload: ', error))
      .finally(() => setInProgress(false))
  }

  const images = watch('images')

  const fetchTagsFilterData = useCallback(async () => {
    const resp = await imageTags({ limit: 'all' })
    setTags(resp.data.tags.map((tag: { tagName: string }) => tag.tagName))
  }, [])

  useEffect(() => {
    fetchTagsFilterData().catch((e) => console.error('error', (e && e.message) || 'something went wrong!', e))
  }, [fetchTagsFilterData])

  return (
    <form className={clsx('px-6 pt-4 pb-6 mx-auto max-w-[618px] block')} onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full bg-yellow-50 p-4 text-center font-semibold text-yellow-700">
        <span className="font-bold">Note: </span>Selected tags and description are applied to all selected images.&nbsp;
        You can change image description and tags later from image page if you own the image.
      </div>
      <div className="mt-8 grid grid-cols gap-x-5 gap-y-6 sm:grid-cols-1">
        <div>
          <div className="mb-2 flex items-center space-x-1">
            <h6 className="font-semibold text-gray-700">Tags</h6>
          </div>
          <Controller
            name="tags"
            control={control}
            rules={{
              validate: (value) => (value.length < 4 && 'minimum 4 tags are required') || true,
            }}
            render={({ field: { onChange, value } }) => {
              return <MultiSelect
                options={tags.map((tag) => ({ label: tag, value: tag }))}
                values={value.map((tag) => ({ label: tag, value: tag }))}
                onChange={(value: any[]) => onChange(value.map((tag) => tag.value))}
                isCreatable
                showTags
              />
            }}
          />
          {errors.tags && <span className="text-sm text-red-500">{errors.tags.message || 'tags are required'}</span>}
        </div>
      </div>
      <div className="mt-8 grid grid-cols gap-x-5 gap-y-6 sm:grid-cols-1">
        <div>
          <div className="mb-2 flex items-center space-x-1">
            <h6 className="font-semibold text-gray-700">Description</h6>
            <span className="text-xs font-normal text-gray-500">(Optional)</span>
          </div>
          <textarea
            rows={5}
            className="form-input-explore form-input w-full"
            {...register('description')}
          />
        </div>
      </div>
      {apiError && <div className="w-full bg-red-50 p-4 text-center font-semibold text-red-700">
        {apiError}
      </div>}
      {errors.images && <span className="text-sm text-red-500">{errors.images.message || 'tags are required'}</span>}
      <Controller
        name="images"
        control={control}
        rules={{
          validate: (value) => (!value.length && 'Please select at least one Image') || true,
        }}
        render={() =>
          <Dropzone
            className="flex h-[324px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-[#FDFDFD] text-center hover:shadow-xl sm:h-[248px] sm:px-3"
            multiple
            accept={{
              'image/png': [],
              'image/jpeg': [],
              'image/gif': [],
            }}
            onChange={(files: any[]) => {
              setValue('images', [...images || [], ...files])
            }}
          >
            <div className="mb-[18px] flex justify-center sm:hidden">
              <CloudUploadIcon className="text-gray-200"/>
            </div>
            <div className="mb-2 text-lg font-semibold text-purple-600 sm:text-base">
              Browse for files & Drag and Drop
            </div>
            <h6 className="mb-2 font-semibold sm:text-sm">Upload atleast one image</h6>
            <div className="min-w-[318px] w-auto text-sm font-normal text-gray-600">
              1092 X 748 or higher recommded. The images is used for previews <br/>
              <em>(Only *.jpg, *.jpeg and *.png images will be accepted)</em>
            </div>
          </Dropzone>
        }
      />
      {Boolean(images && images.length) &&
        <div className="flex flex-nowrap overflow-x-auto pt-5 scrollbar-hide">
          {images?.map((screenshot, i) => {
            return (
              <div key={i} className="mr-3 flex-none">
                <div className="group relative h-[58px] w-[58px] sm:h-[47px] sm:w-[47px]">
                  <Image
                    src={screenshot.imageSrc || screenshot}
                    alt={screenshot.alt || screenshot.filename}
                    layout="fill"
                    objectFit="cover"
                    className="rounded border border-dashed border-gray-300"
                  />
                  <div
                    className="absolute -right-3 -top-3 cursor-pointer rounded-full bg-red-50 p-1 group-hover:flex"
                    onClick={() => {
                      (images || []).splice(i, 1)
                      setValue('images', [...images || []])
                    }}
                  >
                    <CloseIcon className="h-[16px] w-[16px] text-red-500"/>
                  </div>
                  <div
                    className="absolute top-0 left-0 right-0 bottom-0 hidden items-center justify-center bg-[rgb(0,0,0)]/5 group-hover:flex"/>
                </div>
              </div>
            )
          })}
        </div>
      }
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-1">
        <div className="col-span-2 sm:col-span-1">
          <button
            type="submit"
            className="btn btn-lg btn-black w-full"
            disabled={inProgress}
          >
            Upload Now
          </button>
        </div>
      </div>
    </form>
  )
}

export default UploadImageForm
