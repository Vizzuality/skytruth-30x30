import Image from 'next/image';

const EarthSurfaceCoverage: React.FC = () => (
  <div className="relative mt-4 flex justify-center md:-mt-[80px]">
    <Image
      className="h-auto w-full max-w-4xl"
      src="/images/homepage/earth-surface-coverage.svg"
      alt="Earth surface coverage"
      width="0"
      height="0"
      sizes="100vw"
      priority
    />
  </div>
);

export default EarthSurfaceCoverage;
