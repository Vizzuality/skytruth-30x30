import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Feature } from 'geojson';
import { useAtomValue, useSetAtom } from 'jotai';

import { analysisAtom, drawStateAtom } from '@/containers/map/store';
import { AnalysisData } from '@/types/analysis';

const fetchAnalysis = async (feature: Feature) => {
  return axios.post<AnalysisData>(process.env.NEXT_PUBLIC_ANALYSIS_CF_URL, feature);
};

const Analysis = () => {
  const { feature } = useAtomValue(drawStateAtom);
  const setAnalysisState = useSetAtom(analysisAtom);

  const { isFetching, isSuccess, data, isError } = useQuery(
    ['analysis', feature],
    () => fetchAnalysis(feature),
    {
      enabled: Boolean(feature),
      select: ({ data }) => data,
    }
  );

  useEffect(() => {
    setAnalysisState((prevState) => ({
      ...prevState,
      ...(isSuccess && { status: 'success', data }),
      ...(isFetching && { status: 'running' }),
      ...(isError && { status: 'error' }),
    }));
  }, [setAnalysisState, isFetching, isSuccess, data, isError]);

  return null;
};

export default Analysis;
