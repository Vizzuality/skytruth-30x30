import Image from 'next/image';

import { LOGOS, LOGOS_PATH } from './constants';

type LogoProps = {
  logo?: keyof typeof LOGOS;
};

const Logo: React.FC<LogoProps> = ({ logo: logoKey }) => {
  const { logo, link, alt, width, height } = LOGOS[logoKey];

  return (
    <span>
      {link && (
        <a target="_blank" href={link} rel="noopener noreferrer">
          <Image src={`${LOGOS_PATH}${logo}`} alt={alt} width={width} height={height} />
        </a>
      )}
      {!link && (
        <span>
          <Image src={`${LOGOS_PATH}${logo}`} alt={alt} width={width} height={height} />
        </span>
      )}
    </span>
  );
};

export default Logo;
