import { cache } from 'react';

import { WixClient, getWixClient } from '@/lib/wix-client.base';
import { collections } from '@wix/stores';

export const getCollectionBySlug = cache(async (wixClient: WixClient, slug: string) => {
  const { collection } = await wixClient.collections.getCollectionBySlug(slug);

  return collection || null;
});

export const getCollections = cache(
  async (wixClient: WixClient): Promise<collections.Collection[]> => {
    const collections = await wixClient.collections
      .queryCollections()
      .ne('_id', '00000000-000000-000000-000000000001') // all products
      .ne('_id', 'f723fdde-a4f9-b45f-cfa1-a665c9c9dbd8') // featured products
      .find();

    return collections.items;
  },
);
