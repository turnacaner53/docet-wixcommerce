import DiscountBadge from '@/components/DiscountBadge';
import { cn } from '@/lib/utils';
import { products } from '@wix/stores';

interface ProoductPriceProps {
  product: products.Product;
  selectedVariant: products.Variant | null;
}

export default function ProoductPrice({ product, selectedVariant }: ProoductPriceProps) {
  const priceData = selectedVariant?.variant?.priceData || product.priceData;

  if (!priceData) return null; // never should happen

  const hasDiscount = priceData?.discountedPrice !== priceData?.price;

  return (
    <div className='flex items-center gap-2.5 text-xl font-bold'>
      <span className={cn(hasDiscount && 'text-muted-foreground line-through')}>
        {priceData.formatted?.price}
      </span>
      {hasDiscount && <span className='text-primary'>{priceData.formatted?.discountedPrice}</span>}
      {product.discount && <DiscountBadge data={product.discount} />}
    </div>
  );
}
