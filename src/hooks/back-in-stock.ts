import { wixBrowserClient } from '@/lib/wix-client-browser';
import {
  BackInStockNotificationRequestValues,
  createBackInStockNotificationRequest,
} from '@/wix-api/backInStockNotifications';
import { useMutation } from '@tanstack/react-query';

import { useToast } from './use-toast';

export function useCreateBackInStockNotificationRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: BackInStockNotificationRequestValues) =>
      createBackInStockNotificationRequest(wixBrowserClient, values),

    onError(error) {
      console.error(error);
      if (
        (error as any).details.applicationError.code == 'BACK_IN_STOCK_NOTIFICATION_ALREADY_EXISTS'
      ) {
        toast({
          description: "You're already subscribed to this product",
          variant: 'destructive',
        });
      } else {
        toast({
          description: 'Failed to subscribe to back in stock notifications. Please try again',
          variant: 'destructive',
        });
      }
    },
  });
}
