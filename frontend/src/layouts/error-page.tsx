import Link from 'next/link';

import Head from '@/components/head';
import Header from '@/components/header';
import { PAGES } from '@/constants/pages';

export interface ErrorPageLayoutProps {
  pageTitle?: string;
  error: 404 | 500;
  title?: string;
  description?: string;
}

const ErrorPageLayout: React.FC<ErrorPageLayoutProps> = ({
  pageTitle,
  error,
  title,
  description,
}) => (
  <>
    <Head title={pageTitle} description={description} />
    <div className="flex h-screen w-full flex-col">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <div className="flex h-full w-full items-center justify-center border-x border-b border-black">
        <div className="mb-8 inline-block  max-w-2xl p-8 text-center">
          <h1 className="text-9xl font-extrabold leading-none text-orange md:text-[200px]">
            {error}
          </h1>
          <h2 className="my-4 mt-4 text-4xl md:mb-8 md:text-5xl">{title}</h2>
          <p>{description}</p>
          <Link
            href={PAGES.homepage}
            className="mt-6 inline-block bg-black px-8 py-3 font-mono text-xs uppercase text-white md:mt-4"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  </>
);

export default ErrorPageLayout;
