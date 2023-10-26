import DashboardTable from '@/components/dashboard-table';
import { Button } from '@/components/ui/button';
import { useSyncDataToolContentSettings } from '@/containers/data-tool/sync-settings';

import { mockedData } from './mocked-data';

const DataToolDetails: React.FC = () => {
  const [settings, setSettings] = useSyncDataToolContentSettings();

  const handleOnCloseClick = () => {
    setSettings({ ...settings, details: false });
  };

  return (
    <div className="absolute h-full w-full overflow-scroll bg-white px-4 py-4 md:px-6">
      <div className="mb-8 flex gap-8 md:justify-between">
        <span className="max-w-lg">
          <h2 className="text-4xl font-extrabold">
            Marine Conservation at National and Regional Levels
          </h2>
        </span>
        <Button variant="text-link" className="m-0 cursor-pointer p-0" onClick={handleOnCloseClick}>
          Close
        </Button>
      </div>
      <div className="overflow-scroll">
        {/* NOTE: Div to test the horizontal overflow */}
        <div className="mt-4" style={{ width: '130%' }}>
          {/*
            NOTE: We don't need a separate table component, but it's easier
            to have one while using mocked data in order to keep this component clean
          */}
          <DashboardTable data={mockedData} />
        </div>
      </div>
    </div>
  );
};

export default DataToolDetails;
