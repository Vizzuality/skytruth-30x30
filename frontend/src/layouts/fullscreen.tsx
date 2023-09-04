import { PropsWithChildren } from 'react';

import Header from '@/components/header';

const FullscreenLayout: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex h-screen w-screen flex-col">
    <div className="flex-shrink-0">
      <Header />
    </div>
    {children}
  </div>
);

export default FullscreenLayout;
