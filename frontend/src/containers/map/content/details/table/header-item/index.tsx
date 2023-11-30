import { PropsWithChildren } from 'react';

const HeaderItem: React.FC<PropsWithChildren> = ({ children }) => {
  return <span className="flex items-center gap-0">{children}</span>;
};

export default HeaderItem;
