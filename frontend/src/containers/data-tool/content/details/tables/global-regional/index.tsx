import Table from '@/containers/data-tool/content/details/table';
import columns from '@/containers/data-tool/content/details/tables/global-regional/columns';
import mockedData from '@/containers/data-tool/content/details/tables/global-regional/mocked-data';

const GlobalRegionalTable: React.FC = () => {
  const data = mockedData;

  return <Table columns={columns} data={data} />;
};

export default GlobalRegionalTable;
