import { useMemo } from 'react';

import Image from 'next/image';

import Icon from '@/components/ui/icon';
import SidebarItem from '@/containers/homepage/intro/sidebar-item';
import { formatPercentage } from '@/lib/utils/formats';
import ArrowRight from '@/styles/icons/arrow-right.svg?sprite';
import { useGetProtectionCoverageStats } from '@/types/generated/protection-coverage-stat';

type IntroProps = {
  onScrollClick: () => void;
};

const Intro: React.FC<IntroProps> = ({ onScrollClick }) => {
  const {
    data: { data: protectionStatsData },
  } = useGetProtectionCoverageStats(
    {
      filters: {
        location: {
          code: 'GLOB',
        },
      },
      populate: '*',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'sort[year]': 'desc',
      'pagination[limit]': -1,
    },
    {
      query: {
        select: ({ data }) => ({ data }),
        placeholderData: { data: [] },
      },
    }
  );

  const formattedOceanProtectedAreaPercentage = useMemo(() => {
    if (!protectionStatsData) return null;

    const lastProtectionDataYear = Math.max(
      ...protectionStatsData.map(({ attributes }) => attributes.year)
    );

    const protectionStats = protectionStatsData.filter(
      ({ attributes }) => attributes.year === lastProtectionDataYear
    );

    const totalMarineArea =
      protectionStats[0]?.attributes?.location?.data?.attributes?.totalMarineArea;

    const protectedArea = protectionStats.reduce(
      (acc, { attributes }) => acc + attributes?.cumSumProtectedArea,
      0
    );
    const coveragePercentage = (protectedArea * 100) / totalMarineArea;

    if (Number.isNaN(coveragePercentage)) return null;

    return formatPercentage(coveragePercentage, { displayPercentageSign: false });
  }, [protectionStatsData]);

  return (
    <div className="bg-black">
      <div className="flex flex-col text-white md:mx-auto md:max-w-7xl md:flex-row">
        <div className="mt-6 mb-2 flex flex-1 flex-col gap-10 px-8 pt-10">
          <div className="relative">
            <Image
              className="h-auto w-full max-w-4xl"
              src="/images/homepage/intro-30x30.svg"
              alt="SkyTruth 30x30"
              width="0"
              height="0"
              sizes="100vw"
            />
          </div>
          <div className="pr-10 text-5xl font-extrabold leading-tight md:text-6xl">
            Protect 30% of land and ocean by 2030
          </div>
          <div className="mt-16 flex">
            <div className="mb-6 flex flex-grow items-center gap-4 text-xs">
              <span>
                <Image
                  src="/images/static-pages/logos/skytruth-white.png"
                  alt="SkyTruth 30x30 logo"
                  width={57}
                  height={39}
                />
              </span>
              <span className="flex items-center gap-1.5">
                <span>Product powered by</span>
                <Image
                  src="/images/static-pages/logos/bloomberg-white.png"
                  alt="Bloomberg Philanthropies Ocean Initiative logo"
                  width={247}
                  height={29}
                />
              </span>
            </div>
            {/* <div>Social</div> */}
          </div>
        </div>
        <div className="border-l border-t border-white md:w-[40%] md:border-t-0">
          <div className="flex h-full flex-col border-r">
            <SidebarItem
              percentage={formattedOceanProtectedAreaPercentage}
              text="Current global ocean protected area"
              icon="icon1"
            />
            <SidebarItem
              percentage={17.2}
              text="Current global land and inland waters protected area"
              icon="icon2"
            />
            <div className="flex h-full w-full justify-center">
              <button
                type="button"
                className="my-6 flex aspect-square min-h-[140px] items-center justify-center md:w-auto"
                onClick={onScrollClick}
              >
                <Icon icon={ArrowRight} className="h-[60%] rotate-90 fill-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
