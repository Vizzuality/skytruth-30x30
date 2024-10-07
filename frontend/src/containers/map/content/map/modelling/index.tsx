import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import type { Feature } from 'geojson';
import { useAtomValue, useSetAtom } from 'jotai';

import { modellingAtom, drawStateAtom } from '@/containers/map/store';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { ModellingData } from '@/types/modelling';

const fetchModelling = async (tab: string, feature: Feature) => {
  const url =
    tab === 'marine'
      ? process.env.NEXT_PUBLIC_ANALYSIS_CF_MARINE_URL
      : process.env.NEXT_PUBLIC_ANALYSIS_CF_TERRESTRIAL_URL;

  return axios.post<ModellingData>(url, feature);
};

const Modelling = () => {
  const { feature } = useAtomValue(drawStateAtom);
  const setModellingState = useSetAtom(modellingAtom);

  const [{ tab }] = useSyncMapContentSettings();

  const { isFetching, isSuccess, data } = useQuery(
    ['modelling', tab, feature],
    () => fetchModelling(tab, feature),
    {
      enabled: Boolean(feature) && ['marine', 'terrestrial'].includes(tab),
      select: ({ data }) => data,
      refetchOnWindowFocus: false,
      retry: false,
      onError: (req) => {
        if (isAxiosError(req)) {
          setModellingState((prevState) => ({
            ...prevState,
            status: 'error',
            messageError: req.response?.status === 400 ? req.response?.data.error : undefined,
          }));
        } else {
          setModellingState((prevState) => ({
            ...prevState,
            status: 'error',
            messageError: undefined,
          }));
        }
      },
    }
  );

  useEffect(() => {
    setModellingState((prevState) => ({
      ...prevState,
      ...(isSuccess && { status: 'success', data }),
      ...(isFetching && { status: 'running' }),
    }));
  }, [setModellingState, isFetching, isSuccess, data]);

  return null;
};

export default Modelling;
