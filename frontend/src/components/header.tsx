import Image from 'next/image';
import Link from 'next/link';

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
import { cn } from '@/lib/classnames';
import ArrowRight from '@/styles/icons/arrow-right.svg?sprite';

const navigation = [
  { name: 'Data tool', href: '/data-tool', colorClassName: 'text-blue fill-blue' },
  // { name: 'Map', href: '/map', colorClassName: 'text-blue fill-blue' },
  // { name: 'Dashboard', href: '/dashboard', colorClassName: 'text-blue fill-blue' },
  { name: 'Knowledge Hub', href: '/knowledge-hub', colorClassName: 'text-green fill-green' },
  { name: 'About', href: '/about', colorClassName: 'text-black fill-black' },
  { name: 'Contact', href: '/contact-us', colorClassName: 'text-black fill-black' },
];

const Header: React.FC = () => (
  <header className="border-b border-black bg-white font-mono text-sm text-black">
    <nav
      className="mx-auto flex items-center justify-between p-6 py-2.5 md:py-4 lg:px-10"
      aria-label="Global"
    >
      <Link
        href="/"
        className="-m-1.5 p-1.5 ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
      >
        <Image src="/images/skytruth-30-30-logo.svg" alt="SkyTruth 30x30" width={37} height={37} />
      </Link>

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
                      {navigation.map(({ name, href, colorClassName }) => (
                        <ActiveLink
                          key={href}
                          href={href}
                          className="group -mx-3 block px-3 py-2 ring-offset-white hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
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
        {navigation.map(({ name, href, colorClassName }) => (
          <li key={href}>
            <ActiveLink
              href={href}
              className="group -mx-3 block px-3 py-2 ring-offset-white transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              activeClassName="bg-white text-black hover:bg-white is-active"
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
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header;
