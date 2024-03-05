import { FC } from 'react';

import Script from 'next/script';

const Analytics: FC = () => {
  const GAKey = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
    <>
      {!!GAKey && (
        <>
          <Script
            id="google-tag-manager"
            src={`https://www.googletagmanager.com/gtag/js?id=${GAKey}`}
          />
          <Script
            id="google-tag-manager-init"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GAKey}');
              `,
            }}
          />
        </>
      )}
    </>
  );
};

export default Analytics;
