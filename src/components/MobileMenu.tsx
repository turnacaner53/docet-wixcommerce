'use client';

import { useEffect, useState } from 'react';

import { twConfig } from '@/lib/utils';
import { members } from '@wix/members';
import { collections } from '@wix/stores';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import SearchField from './SearchField';
import UserButton from './UserButton';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

interface MobileMenuProps {
  collections: collections.Collection[];
  loggedInMember: members.Member | null;
}

export default function MobileMenu({ collections, loggedInMember }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > parseInt(twConfig.theme.screens.lg)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathName, searchParams]);

  return (
    <>
      <Button
        size='icon'
        variant='ghost'
        className='inline-flex lg:hidden'
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side='left' className='w-full'>
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className='flex flex-col items-center space-y-10 py-10'>
            <SearchField className='w-full' />
            <ul className='space-y-5 text-center text-lg'>
              <li>
                <Link href='/shop' className='font-semibold hover:underline'>
                  Shop
                </Link>
              </li>
              {collections.map((collection) => (
                <li key={collection._id}>
                  <Link
                    href={`/collections/${collection.slug}`}
                    className='font-semibold hover:underline'
                  >
                    {collection.name}
                  </Link>
                </li>
              ))}
            </ul>
            <UserButton loggedInMember={loggedInMember} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
