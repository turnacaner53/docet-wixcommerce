import { useState } from 'react';

import { wixBrowserClient } from '@/lib/wix-client-browser';
import {
  GetCheckoutUrlForProductValues,
  getCheckoutUrlForCurrentCart,
  getCheckoutUrlForProduct,
} from '@/wix-api/checkout';

import { useToast } from './use-toast';

export function useCartCheckout() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  async function startCheckoutFlow() {
    setPending(true);

    try {
      const checkoutUrl = await getCheckoutUrlForCurrentCart(wixBrowserClient);
      window.location.href = checkoutUrl;
    } catch (error) {
      setPending(false);
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to start checkout flow',
      });
    }
  }

  return { startCheckoutFlow, pending };
}

export function useQuickBuy() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  async function startCheckoutFlow(values: GetCheckoutUrlForProductValues) {
    setPending(true);

    try {
      const checkoutUrl = await getCheckoutUrlForProduct(wixBrowserClient, values);
      window.location.href = checkoutUrl;
    } catch (error) {
      setPending(false);
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to start checkout flow',
      });
    }
  }
  return { startCheckoutFlow, pending };
}
