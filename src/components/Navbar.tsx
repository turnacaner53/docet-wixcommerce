import { Suspense } from 'react';

import logo from '@/assets/logo.png';
import { getWixServerClient } from '@/lib/wix-client-server';
import { getCart } from '@/wix-api/cart';
import { getCollections } from '@/wix-api/collections';
import { getLoggedInMember } from '@/wix-api/members';
import Image from 'next/image';
import Link from 'next/link';

import MainNavigation from './MainNavigation';
import MobileMenu from './MobileMenu';
import SearchField from './SearchField';
import ShoppingCartButton from './ShoppingCartButton';
import UserButton from './UserButton';

export default async function Navbar() {
  const wixClient = getWixServerClient();

  const [cart, loggedInMember, collections] = await Promise.all([
    getCart(wixClient),
    getLoggedInMember(wixClient),
    getCollections(wixClient),
  ]);

  return (
    <header className='bg-background shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-5 p-5'>
        <Suspense>
          <MobileMenu collections={collections} loggedInMember={loggedInMember} />
        </Suspense>
        <div className='flex flex-wrap items-center gap-5'>
          <Link href='/' className='flex items-center gap-4'>
            <Image src={logo} alt='Docet Shop' width={40} height={40} />
            <span className='hidden text-xl font-bold md:block'>Docet Shop</span>
          </Link>
          <MainNavigation collections={collections} className='hidden lg:flex' />
        </div>
        <SearchField className='hidden max-w-96 lg:inline' />
        <div className='flex items-center justify-center gap-5'>
          <span className='hidden lg:block'>
            Hi! {loggedInMember?.contact?.firstName || loggedInMember?.loginEmail?.split('@')[0]}
          </span>
          <UserButton loggedInMember={loggedInMember} className='hidden md:inline-flex' />
          <ShoppingCartButton initialData={cart} />
        </div>
      </div>
    </header>
  );
}
