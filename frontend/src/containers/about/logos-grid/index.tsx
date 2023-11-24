import Image from 'next/image';

import { LOGOS, LOGOS_PATH } from './constants';

type LogosGridProps = {
  type: 'team' | 'funders';
};

const LogosGrid: React.FC<LogosGridProps> = ({ type }) => (
  <div className="grid gap-4 md:grid-cols-4">
    {LOGOS[type].map(({ logo, alt, link, description, width, height }) => (
      <div key={logo} className="flex flex-col gap-4 pr-4">
        <span className="flex flex-1 items-center justify-center md:justify-start">
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
        <span className="min-h-[60px] text-center md:text-left">{description}</span>
      </div>
    ))}
  </div>
);

export default LogosGrid;
