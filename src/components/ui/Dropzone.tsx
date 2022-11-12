import { FC, ReactNode, useCallback } from 'react'

import { Accept, useDropzone } from 'react-dropzone'

const Dropzone: FC<{
  className: string
  multiple?: boolean
  accept?: Accept
  onChange: Function
  children?: ReactNode
}> = (props) => {
  const { className, children, multiple, accept, onChange } = props

  const onDrop = useCallback((acceptedFiles: any[]) => {
    const files = acceptedFiles.map((file) => {
      if (file) {
        file.imageSrc = URL.createObjectURL(file as Blob)
      }
      return file
    })
    onChange(files)
  }, [onChange])

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    multiple,
    accept,
  })

  return <div
    className={className}
    {...getRootProps()}
  >
    <input {...getInputProps()}/>
    {children || <p>Drag &apos;n&apos; drop some files here, or click to select files</p>}
  </div>
}

export default Dropzone
