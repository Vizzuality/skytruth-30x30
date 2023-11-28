import Icon from '@/components/ui/icon';
import SadFaceIcon from '@/styles/icons/sad-face.svg?sprite';

const NoData: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 px-14 py-12 text-center md:px-10 md:py-14">
      <div className="px-6">
        <Icon icon={SadFaceIcon} className="" />
      </div>
      <p className="text-xs">The current widget is not visible because of data unavailability.</p>
    </div>
  );
};

export default NoData;
