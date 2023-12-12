import Icon from '@/components/ui/icon';
import SadFaceIcon from '@/styles/icons/sad-face.svg?sprite';

type NoDataProps = {
  error?: boolean;
};

const NoData: React.FC<NoDataProps> = ({ error = false }) => {
  return (
    <div className="flex flex-col gap-8 px-14 py-12 text-center md:px-10 md:py-14">
      <div className="px-6">
        <Icon icon={SadFaceIcon} className="" />
      </div>
      <p className="text-xs">
        {error && <>The current widget is not visible due to an error.</>}
        {!error && <>The current widget is not visible because of data unavailability.</>}
      </p>
    </div>
  );
};

export default NoData;
