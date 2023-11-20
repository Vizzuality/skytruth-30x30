import Image from 'next/image';

import { LOGOS, LOGOS_PATH } from './constants';

type LogoProps = {
  logo?: keyof typeof LOGOS;
};

const Logo: React.FC<LogoProps> = ({ logo: logoKey }) => {
  const { logo, alt, dimensions } = LOGOS[logoKey];

  return (
    <div>
      <Image src={`${LOGOS_PATH}${logo}`} alt={alt} width={dimensions[0]} height={dimensions[1]} />
    </div>
  );
};

export default Logo;
