type NoDataProps = {
  error?: boolean;
};

const NoData: React.FC<NoDataProps> = ({ error = false }) => {
  return (
    <div className="flex flex-col gap-8 px-14 py-12 text-center md:px-10 md:py-14">
      <p className="text-xs">
        {error && <>The current widget is not visible due to an error.</>}
        {!error && <>Data not available</>}
      </p>
    </div>
  );
};

export default NoData;
