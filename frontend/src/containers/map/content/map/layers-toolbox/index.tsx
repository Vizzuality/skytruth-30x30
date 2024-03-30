import Legend from './legend';

const LayersLegend = (): JSX.Element => {
  return (
    <div className="absolute bottom-0 right-0 flex max-h-[calc(100%-100px)] w-[335px] overflow-y-scroll border border-black bg-white py-3 px-6">
      <Legend />
    </div>
  );
};

export default LayersLegend;
