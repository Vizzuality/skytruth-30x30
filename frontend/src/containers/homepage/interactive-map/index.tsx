import Image from 'next/image';

const InteractiveMap: React.FC = () => (
  <div className="relative flex justify-center">
    <Image
      className="h-auto w-full max-w-4xl"
      src="/images/homepage/map.svg"
      alt="SkyTruth 30x30"
      width="0"
      height="0"
      sizes="100vw"
      priority
    />
  </div>
);

export default InteractiveMap;
