import Table from '@/containers/data-tool/content/details/table';
import columns from '@/containers/data-tool/content/details/tables/national-highseas/columns';
import mockedData from '@/containers/data-tool/content/details/tables/national-highseas/mocked-data';

const NationalHighseasTable: React.FC = () => {
  const data = mockedData;

  return <Table columns={columns} data={data} />;
};

export default NationalHighseasTable;
