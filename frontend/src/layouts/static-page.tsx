import { MutableRefObject, PropsWithChildren, ReactNode } from 'react';

import Head from 'next/head';

import Footer from '@/components/footer';
import Header, { HeaderProps } from '@/components/header';
import Icon from '@/components/ui/icon';
import ArrowRight from '@/styles/icons/arrow-right.svg?sprite';

type SidebarProps = {
  sections: {
    [key: string]: {
      name: string;
      ref: MutableRefObject<HTMLDivElement>;
    };
  };
};

const Sidebar: React.FC<SidebarProps> = ({ sections }) => {
  if (!sections) return null;

  const handleClick = (key) => {
    const section = sections[key];
    if (!section) return;
    section.ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mb-4 min-w-[200px] md:mb-0">
      <nav className="sticky top-10 bottom-3 mt-10 flex flex-col gap-3 font-mono text-sm">
        {Object.entries(sections).map(([key, { name }]) => {
          return (
            <button
              key={key}
              className="flex w-full items-center gap-3"
              type="button"
              onClick={() => handleClick(key)}
            >
              <Icon icon={ArrowRight} className="h-6 fill-black" />
              <span className="pt-1">{name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

type ContentProps = PropsWithChildren;

const Content: React.FC<ContentProps> = ({ children }) => {
  return <div className="flex-1">{children}</div>;
};

export interface StaticPageLayoutProps {
  title?: string;
  description?: string;
  hero?: ReactNode;
  bottom?: ReactNode;
}

const StaticPageLayout: React.FC<
  PropsWithChildren<StaticPageLayoutProps & Pick<HeaderProps, 'theme' | 'hideLogo'>>
> = ({ title, description, hero, bottom, children, theme, hideLogo }) => (
  <>
    <Head>
      <title>{`${title ? `${title} | ` : ''}Skytruth 30x30`}</title>
      {description && <meta name="description" content={description} />}
    </Head>
    <div className="flex h-screen w-full flex-col">
      <div className="flex-shrink-0">
        <Header theme={theme} hideLogo={hideLogo} />
      </div>
      {hero && <>{hero}</>}
      <div className="flex w-full flex-col gap-6 py-0 md:mx-auto md:max-w-7xl md:flex-row md:pt-24 md:pl-8">
        {children}
      </div>
      {bottom && <>{bottom}</>}
      <Footer />
    </div>
  </>
);

export default StaticPageLayout;
export { Content, Sidebar };
