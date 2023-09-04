import Link from 'next/link';

import { Menu } from 'lucide-react';

import ActiveLink from '@/components/active-link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navigation = [
  { name: 'Map', href: '/map' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Knowledge Hub', href: '/knowledge-hub' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Header: React.FC = () => (
  <header className="bg-black text-white">
    <nav
      className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <Link
        href="/"
        className="-m-1.5 rounded-lg p-1.5 ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
      >
        Logo
      </Link>

      {/* Mobile hamburger menu */}
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger className="rounded-lg px-3 py-2 ring-offset-white hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="sr-only">Main menu</SheetTitle>
              <SheetDescription>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navigation.map(({ name, href }) => (
                        <ActiveLink
                          key={href}
                          href={href}
                          className="-mx-3 block rounded-lg px-3 py-2 font-semibold leading-7 ring-offset-white hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                          activeClassName="bg-black text-white hover:bg-black"
                        >
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

      <ul className="hidden md:flex md:gap-x-12">
        {navigation.map(({ name, href }) => (
          <li key={href}>
            <ActiveLink
              href={href}
              className="-mx-3 block rounded-lg px-3 py-2 font-semibold leading-7 ring-offset-black hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              activeClassName="bg-white text-black hover:bg-white"
            >
              {name}
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header;
