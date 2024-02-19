import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Feature } from 'geojson';
import { useAtomValue, useSetAtom } from 'jotai';

import { modellingAtom, drawStateAtom } from '@/containers/map/store';
import { ModellingData } from '@/types/modelling';

const fetchModelling = async (feature: Feature) => {
  return axios.post<ModellingData>(process.env.NEXT_PUBLIC_ANALYSIS_CF_URL, feature);
};

const Modelling = () => {
  const { feature } = useAtomValue(drawStateAtom);
  const setModellingState = useSetAtom(modellingAtom);

  const { isFetching, isSuccess, data, isError } = useQuery(
    ['modelling', feature],
    () => fetchModelling(feature),
    {
      enabled: Boolean(feature),
      select: ({ data }) => data,
    }
  );

  useEffect(() => {
    setModellingState((prevState) => ({
      ...prevState,
      ...(isSuccess && { status: 'success', data }),
      ...(isFetching && { status: 'running' }),
      ...(isError && { status: 'error' }),
    }));
  }, [setModellingState, isFetching, isSuccess, data, isError]);

  return null;
};

export default Modelling;
