const ChartLegend = () => {
  return (
    <div className="ml-8 mt-2 flex justify-between gap-3">
      <span className="inline-flex items-center gap-3">
        <span className="block h-[2px] w-10 border-b-2 border-blue"></span>
        <span>Historical Trend</span>
      </span>
      <span className="inline-flex items-center gap-3">
        <span className="block h-[2px] w-10 border-b-2 border-dashed border-blue"></span>
        <span>Future Projection</span>
      </span>
    </div>
  );
};

export default ChartLegend;
