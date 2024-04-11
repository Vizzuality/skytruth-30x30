type NoDataProps = {
  error?: boolean;
  message?: string;
};

const NoData: React.FC<NoDataProps> = ({
  error = false,
  message = 'The current widget is not visible due to an error.',
}) => {
  return (
    <div className="flex flex-col gap-8 px-14 py-12 text-center md:px-10 md:py-14">
      <p className="text-xs">
        {error && message}
        {!error && <>Data not available</>}
      </p>
    </div>
  );
};

export default NoData;
