import { useState } from 'react'

import NextImage, { ImageLoaderProps, ImageProps, StaticImageData } from 'next/image'

import Default from 'assets/common/no-image.png'

const myLoader = (noSize?: boolean) => ({ src, width, quality }: ImageLoaderProps) => {
  return `${src}${!noSize ? `?w=${width}&q=${quality || 75}` : ''}`
}

const Image = ({ noSize, ...props }: ImageProps & { noSize?: boolean }) => {
  const [fallbackImage, setFallbackImage] = useState<StaticImageData | null>(null)
  return <NextImage
    loader={myLoader(noSize)}
    {...props}
    src={fallbackImage || props.src || Default}
    onError={({ currentTarget }) => {
      currentTarget.onerror = null;
      // prevents looping
      setFallbackImage(Default)
    }}
  />
}

export default Image
