import { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';

import WixImage from '@/components/WixImage';
import { cn } from '@/lib/utils';
import { products } from '@wix/stores';
import { PlayIcon } from 'lucide-react';

interface ProductMediaProps {
  media: products.MediaItem[] | undefined;
}

export default function ProductMedia({ media }: ProductMediaProps) {
  const [selectedMedia, setSelectedMedia] = useState(media?.[0]);

  useEffect(() => {
    setSelectedMedia(media?.[0]);
  }, [media]);

  if (!media?.length) return null;

  const selectedImage = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.[0];

  return (
    <div className='h-fit basis-2/5 md:sticky md:top-10'>
      <div className='aspect-square bg-secondary'>
        {selectedImage?.url ? (
          <Zoom key={selectedImage.url}>
            <WixImage
              mediaIdentifier={selectedImage.url}
              alt={selectedImage.altText}
              height={1000}
              width={1000}
              className='sticky top-0'
            />
          </Zoom>
        ) : selectedVideo?.url ? (
          <div className='flex size-full items-center bg-black'>
            <video controls className='size-full'>
              <source src={selectedVideo.url} type={`video/${selectedVideo.format}`} />
            </video>
          </div>
        ) : null}
      </div>
      {media.length > 1 && (
        <div className='mt-2 flex flex-wrap gap-3'>
          {media.map((item) => (
            <MediaPreview
              key={item._id}
              mediaItem={item}
              isSelected={item._id === selectedMedia?._id}
              onSelect={() => setSelectedMedia(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MediaPreviewProps {
  mediaItem: products.MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

function MediaPreview({ mediaItem, isSelected, onSelect }: MediaPreviewProps) {
  const imageUrl = mediaItem.image?.url;
  const stillFrameMediaId = mediaItem.video?.stillFrameMediaId;
  const thumbnailUrl = mediaItem.thumbnail?.url;
  const resolvedThumbnailUrl =
    stillFrameMediaId && thumbnailUrl
      ? thumbnailUrl.split(stillFrameMediaId)[0] + stillFrameMediaId
      : undefined;

  if (!imageUrl && !resolvedThumbnailUrl) return null;

  return (
    <div
      className={cn(
        'relative cursor-pointer bg-secondary',
        isSelected && 'outline-1 outline-primary',
      )}
    >
      <WixImage
        mediaIdentifier={imageUrl || resolvedThumbnailUrl}
        alt={mediaItem.image?.altText || mediaItem.video?.files?.[0].altText}
        width={100}
        height={100}
        onMouseEnter={onSelect}
      />
      {resolvedThumbnailUrl && (
        <span className='absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40'>
          <PlayIcon className='size-5 text-white/60' />
        </span>
      )}
    </div>
  );
}
