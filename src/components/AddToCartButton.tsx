import { useAddItemToCart } from '@/hooks/cart';
import { cn } from '@/lib/utils';
import { wixBrowserClient } from '@/lib/wix-client-browser';
import { addToCart } from '@/wix-api/cart';
import { products } from '@wix/stores';

import LoadingButton from './LoadingButton';
import { Button, ButtonProps } from './ui/button';
import { ShoppingCartIcon } from 'lucide-react';

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
  className?: string;
}

export default function AddToCartButton({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: AddToCartButtonProps) {
  const mutation = useAddItemToCart();

  return (
    <LoadingButton
      onClick={() =>
        mutation.mutate({
          product,
          selectedOptions,
          quantity,
        })
      }
      className={cn('flex gap-3', className)}
      {...props}
      loading={mutation.isPending}
    >
      <ShoppingCartIcon />
      {mutation.isPending ? 'Adding...' : 'Add to cart'}
    </LoadingButton>
  );
}
