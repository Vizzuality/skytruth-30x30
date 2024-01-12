import NextHead from 'next/head';

export type HeadProps = {
  title?: string;
  description?: string;
};

const Head: React.FC<HeadProps> = ({ title, description }) => (
  <NextHead>
    <title>{`${title ? `${title} | ` : ''}SkyTruth 30x30`}</title>
    {description && <meta name="description" content={description} />}
  </NextHead>
);

export default Head;
