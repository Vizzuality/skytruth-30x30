import Image from 'next/image';

import { LOGOS, LOGOS_PATH } from './constants';

type LogoProps = {
  logo?: keyof typeof LOGOS;
};

const Logo: React.FC<LogoProps> = ({ logo: logoKey }) => {
  const { logo, alt, width, height } = LOGOS[logoKey];

  return (
    <span>
      <Image src={`${LOGOS_PATH}${logo}`} alt={alt} width={width} height={height} />
    </span>
  );
};

export default Logo;
