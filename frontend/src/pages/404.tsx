import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import DefaultLayout from '@/layouts/default';

const Home: React.FC = () => (
  <DefaultLayout title="Page Not Found">
    <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
      <p className="text-base font-semibold leading-8">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Page Not Found</h1>
      <p className="mt-4 text-base sm:mt-6">Sorry, we couldn’t find the page you’re looking for.</p>
      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="text-sm font-semibold leading-7 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <ArrowLeft className="mr-2 inline-block h-6 w-6" aria-hidden /> Back to home
        </Link>
      </div>
    </div>
  </DefaultLayout>
);

export default Home;
