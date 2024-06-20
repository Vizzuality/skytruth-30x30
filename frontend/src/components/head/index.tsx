import NextHead from 'next/head';
import { useRouter } from 'next/router';

export type HeadProps = {
  title?: string;
  description?: string;
};

const Head: React.FC<HeadProps> = ({ title, description }) => {
  const { locales, asPath } = useRouter();

  return (
    <NextHead>
      <title>{`${title ? `${title} | ` : ''}SkyTruth 30x30`}</title>
      {description && <meta name="description" content={description} />}
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${new URL(process.env.NEXT_PUBLIC_API_URL).origin}/${locale}${asPath}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${new URL(process.env.NEXT_PUBLIC_API_URL).origin}${asPath}`}
      />
    </NextHead>
  );
};

export default Head;
