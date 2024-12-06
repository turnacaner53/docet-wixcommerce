import { ImgHTMLAttributes } from 'react';

import { media as wixMedia } from '@wix/sdk';

type WixImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'width' | 'height' | 'alt'
> & {
  mediaIdentifier: string | undefined;
  placeholder?: string;
  alt?: string | null | undefined;
} & (
    | {
        scaleToFill?: true;
        width: number;
        height: number;
      }
    | {
        scaleToFill?: false;
      }
  );

export default function WixImage({
  mediaIdentifier,
  placeholder = '/public/placeholder.png',
  alt,
  ...props
}: WixImageProps) {
  const imageUrl = mediaIdentifier
    ? props.scaleToFill || props.scaleToFill === undefined
      ? 'width' in props && 'height' in props
        ? wixMedia.getScaledToFillImageUrl(mediaIdentifier, props.width, props.height, {})
        : placeholder
      : wixMedia.getImageUrl(mediaIdentifier).url
    : placeholder;

  return <img src={imageUrl} alt={alt || ''} {...props} />;
}
