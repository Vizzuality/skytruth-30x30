import { ComponentProps } from 'react';

import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';

import { PAGES } from '@/constants/pages';
import MapLayout from '@/layouts/map';
import { fetchTranslations } from '@/lib/i18n';
import mapParamsToSearchParams from '@/lib/mapparams-to-searchparams';
import { FCWithMessages } from '@/types';
import { getGetLocationsQueryKey, getGetLocationsQueryOptions } from '@/types/generated/location';
import { LocationListResponse } from '@/types/generated/strapi.schemas';

import { LayoutProps } from '../_app';

const ConservationBuilderPage: FCWithMessages & {
  layout: LayoutProps<
    { location: { code: string; name: string } },
    ComponentProps<typeof MapLayout>
  >;
} = () => {
  return null;
};

ConservationBuilderPage.layout = {
  Component: MapLayout,
  props: {
    title: '',
    type: 'conservation-builder',
  },
};

ConservationBuilderPage.messages = ['pages.conservation-builder', ...MapLayout.messages];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { locationCode = 'GLOB', location, mapParams = null } = query;

  if (mapParams) {
    const searchParams = mapParamsToSearchParams(mapParams);
    const target = `${PAGES.conservationBuilder}/${location}?${searchParams}`;

    return {
      redirect: {
        permanent: false,
        destination: target,
      },
    };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    ...getGetLocationsQueryOptions({
      filters: {
        code: locationCode,
      },
    }),
  });

  const locationsData = queryClient.getQueryData<LocationListResponse>(
    getGetLocationsQueryKey({
      filters: {
        code: locationCode,
      },
    })
  );

  if (!locationsData || !locationsData.data) return { notFound: true };

  return {
    props: {
      location: locationsData.data[0].attributes || {
        code: 'GLOB',
        name: 'Global',
      },
      dehydratedState: dehydrate(queryClient),
      messages: await fetchTranslations(context.locale, ConservationBuilderPage.messages),
    },
  };
};

export default ConservationBuilderPage;
