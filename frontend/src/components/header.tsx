import Image from 'next/image';
import Link from 'next/link';

import { VariantProps, cva } from 'class-variance-authority';
import { Menu } from 'lucide-react';

import ActiveLink from '@/components/active-link';
import Icon from '@/components/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PAGES } from '@/constants/pages';
import { cn } from '@/lib/classnames';
import ArrowRight from '@/styles/icons/arrow-right.svg?sprite';

const NAVIGATION_ITEMS = [
  { name: 'Progress tracker', href: PAGES.progressTracker, colorClassName: 'text-orange' },
  { name: 'Conservation builder', href: PAGES.conservationBuilder, colorClassName: 'text-blue' },
  { name: 'Knowledge hub', href: PAGES.knowledgeHub, colorClassName: 'text-green' },
  { name: 'About', href: PAGES.about, colorClassName: 'text-violet' },
  { name: 'Contact', href: PAGES.contact, colorClassName: 'text-black' },
];

const headerVariants = cva('', {
  variants: {
    theme: {
      normal: 'border border-black bg-white text-black',
      dark: 'border-white bg-black text-white',
    },
  },
  defaultVariants: {
    theme: 'normal',
  },
});

const buttonVariants = cva('', {
  variants: {
    theme: {
      normal: 'ring-offset-white hover:bg-gray-50 focus-visible:ring-black',
      dark: 'ring-offset-black hover:bg-gray-50 focus-visible:ring-white',
    },
  },
  defaultVariants: {
    theme: 'normal',
  },
});

export type HeaderProps = VariantProps<typeof headerVariants> & {
  hideLogo?: boolean;
};

const Header: React.FC<HeaderProps> = ({ theme, hideLogo = false }) => (
  <header className={cn('border-b font-mono text-sm', headerVariants({ theme }))}>
    <nav
      className="mx-auto flex items-center justify-between p-6 py-2.5 md:py-3 lg:px-10"
      aria-label="Global"
    >
      <span className="flex">
        {!hideLogo && (
          <Link
            href="/"
            className="-my-1.5 inline-block ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            <Image
              src="/images/skytruth-30-30-logo.svg"
              alt="SkyTruth 30x30"
              width={25}
              height={25}
            />
          </Link>
        )}
      </span>

      {/* Mobile hamburger menu */}
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger className="px-3 py-2 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="sr-only">Main menu</SheetTitle>
              <SheetDescription>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6 font-mono text-sm">
                      {NAVIGATION_ITEMS.map(({ name, href, colorClassName }) => (
                        <ActiveLink
                          key={href}
                          href={href}
                          className={cn(
                            'group -mx-3 block px-3 py-2  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                            buttonVariants({ theme })
                          )}
                          activeClassName="is-active"
                        >
                          <Icon
                            icon={ArrowRight}
                            className={cn(
                              'mr-2.5 hidden w-5 fill-black group-[.is-active]:inline-block',
                              colorClassName
                            )}
                          />
                          {name}
                        </ActiveLink>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <ul className="hidden md:flex md:gap-x-10">
        {NAVIGATION_ITEMS.map(({ name, href, colorClassName }) => (
          <li key={href}>
            <ActiveLink
              href={href}
              className="group -mx-3 flex px-3 py-2 ring-offset-white transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              activeClassName="bg-white text-black hover:bg-white is-active"
            >
              <Icon
                icon={ArrowRight}
                className={cn(
                  'mr-2.5 -mt-1 hidden w-5 fill-black group-[.is-active]:inline-block',
                  colorClassName
                )}
              />
              {name}
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header;
