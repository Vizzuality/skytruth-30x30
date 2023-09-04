import Head from 'next/head';
import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { DefaultLayout } from '@/layouts/default';

const Home: React.FC = () => (
  <DefaultLayout>
    <Head>
      <title>Internal Server Error</title>
    </Head>
    <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
      <p className="text-base font-semibold leading-8">500</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Internal Server Error</h1>
      <p className="mt-4 text-base sm:mt-6">Sorry, something went wrong.</p>
      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="rounded-lg text-sm font-semibold leading-7 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          <ArrowLeft className="mr-2 inline-block h-6 w-6" aria-hidden /> Back to home
        </Link>
      </div>
    </div>
  </DefaultLayout>
);

export default Home;
