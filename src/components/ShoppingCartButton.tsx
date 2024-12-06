'use client';

import { useState } from 'react';

import { useCart, useRemoveCartItem, useUpdateCartItemQuantity } from '@/hooks/cart';
import { currentCart } from '@wix/ecom';
import { Loader2, ShoppingCartIcon, XIcon } from 'lucide-react';
import Link from 'next/link';

import CheckoutButton from './CheckoutButton';
import WixImage from './WixImage';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

interface ShoppingCartButtonProps {
  initialData: currentCart.Cart | null;
}

export default function ShoppingCartButton({ initialData }: ShoppingCartButtonProps) {
  const cartQuery = useCart(initialData);
  const [sheetOpen, setSheetOpen] = useState(false);

  const totalQuantity =
    cartQuery.data?.lineItems?.reduce((acc, item) => acc + (item.quantity || 0), 0) ?? 0;

  return (
    <>
      <div className='relative'>
        <Button variant='ghost' size='icon' onClick={() => setSheetOpen(true)}>
          <ShoppingCartIcon />
          <span className='absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'>
            {totalQuantity < 10 ? totalQuantity : '9+'}
          </span>
        </Button>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className='flex flex-col sm:max-w-lg'>
          <SheetHeader>
            <SheetTitle>
              Your Cart{' '}
              <span className='text-base'>
                ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className='flex grow flex-col space-y-5 overflow-y-auto pt-1'>
            <ul className='space-y-5'>
              {cartQuery.data?.lineItems?.map((item) => (
                <ShoppingCartItem
                  key={item?._id}
                  item={item}
                  onProductLinkClicked={() => setSheetOpen(false)}
                />
              ))}
            </ul>

            {cartQuery.isPending && <Loader2 className='mx-auto animate-spin' />}
            {cartQuery.error && <p className='text-destructive'>{cartQuery.error.message}</p>}
            {!cartQuery.isPending && !cartQuery.data?.lineItems?.length && (
              <div className='flex grow items-center justify-center text-center'>
                <div className='space-y-1.5'>
                  <p className='text-lg font-semibold'>Your cart is empty</p>
                  <Link
                    href='/shop'
                    className='text-lg text-primary hover:underline'
                    onClick={() => setSheetOpen(false)}
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
          <hr />
          <div className='flex items-center justify-between gap-5'>
            <div className='space-y-0.5'>
              <p className='text-sm'>Subtotal amount</p>
              {/* @ts-expect-error (for subtotal)*/}
              <p className='font-bold'>{cartQuery?.data?.subtotal?.formattedConvertedAmount}</p>
              <p className='text-xs text-muted-foreground'>
                Shipping and taxes calculated at checkout
              </p>
            </div>
            <CheckoutButton disabled={!totalQuantity || cartQuery.isFetching} size='lg' />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface ShoppingCartItemProps {
  item: currentCart.LineItem;
  onProductLinkClicked?: () => void;
}

function ShoppingCartItem({ item, onProductLinkClicked }: ShoppingCartItemProps) {
  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();
  const productId = item._id;

  if (!productId) return null; //should never happen

  const slug = item.url?.split('/').pop();
  const quantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable;

  return (
    <li className='flex items-center gap-3'>
      <div className='relative size-fit flex-none'>
        <Link href={`/products/${slug}`} onClick={onProductLinkClicked}>
          <WixImage
            mediaIdentifier={item.image}
            width={110}
            height={110}
            alt={item.productName?.translated || 'Product image'}
            className='flex-none bg-secondary'
          />
        </Link>
        <button onClick={() => removeItemMutation.mutate(productId)}>
          <XIcon className='absolute -right-0.5 -top-0.5 size-6 rounded-full border bg-background p-0.5 hover:bg-destructive hover:text-white' />
        </button>
      </div>
      <div className='space-y-1.5 text-sm'>
        <Link href={`/products/${slug}`} onClick={onProductLinkClicked}>
          <p className='font-bold'>{item.productName?.translated || 'item'}</p>
        </Link>
        {!!item.descriptionLines?.length && (
          <p className=''>
            {item.descriptionLines
              .map((line) => line.colorInfo?.translated || line.plainText?.translated)
              .join(', ')}
          </p>
        )}
        <div className='flex items-center gap-2'>
          {item.quantity} x {item.price?.formattedConvertedAmount}
          {item.fullPrice && item.fullPrice.amount !== item.price?.amount && (
            <span className='text-muted-foreground line-through'>
              {item.fullPrice.formattedConvertedAmount}
            </span>
          )}
        </div>
        <div className='flex items-center gap-1.5'>
          <Button
            onClick={() =>
              updateQuantityMutation.mutate({
                productId,
                newQuantity: !item.quantity ? 0 : item.quantity - 1,
              })
            }
            variant='outline'
            size='sm'
            disabled={item.quantity === 1}
          >
            -
          </Button>
          <span>{item.quantity}</span>
          <Button
            onClick={() =>
              updateQuantityMutation.mutate({
                productId,
                newQuantity: !item.quantity ? 1 : item.quantity + 1,
              })
            }
            variant='outline'
            size='sm'
            disabled={quantityLimitReached}
          >
            +
          </Button>
          {quantityLimitReached && <span>Quantity limit reached</span>}
        </div>
      </div>
    </li>
  );
}
