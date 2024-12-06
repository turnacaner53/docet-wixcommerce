import { useForm } from 'react-hook-form';

import { env } from '@/env';
import { useCreateBackInStockNotificationRequest } from '@/hooks/back-in-stock';
import { cn } from '@/lib/utils';
import { requiredString } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { products } from '@wix/stores';
import { z } from 'zod';

import LoadingButton from './LoadingButton';
import { Button, ButtonProps } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';

const formSchema = z.object({
  email: requiredString.email(),
});

type FormValues = z.infer<typeof formSchema>;

interface BackInStockNotificationButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  className?: string;
}

export default function BackInStockNotificationButton({
  product,
  selectedOptions,
  className,
  ...props
}: BackInStockNotificationButtonProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const mutation = useCreateBackInStockNotificationRequest();

  async function onSubmit({ email }: FormValues) {
    mutation.mutate({
      email,
      itemUrl: env.NEXT_PUBLIC_BASE_URL + '/products/' + product.slug,
      product,
      selectedOptions,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn('', className)} {...props}>
          Notify when available
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Notify me when <span className='text-primary'>{product.name}</span> is back in stock
          </DialogTitle>
          <DialogDescription>
            Enter your email address and we&apos;ll let you know when this product is back in stock.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton type='submit' loading={mutation.isPending}>
              Notify me
            </LoadingButton>
          </form>
        </Form>
        {mutation.isSuccess && (
          <div className='py-2 text-green-800 dark:text-green-400'>
            Thank you! We will notify you when this product is back in stock.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
