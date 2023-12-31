/**
 * Generated by orval v6.18.1 🍺
 * Do not edit manually.
 * DOCUMENTATION
 * OpenAPI spec version: 1.0.0
 */
import { useQuery } from '@tanstack/react-query';
import type {
  UseQueryOptions,
  QueryFunction,
  UseQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import type {
  MpaProtectionCoverageStatListResponse,
  Error,
  GetMpaProtectionCoverageStatsParams,
  MpaProtectionCoverageStatResponse,
  GetMpaProtectionCoverageStatsIdParams,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

// eslint-disable-next-line
type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P
) => any
  ? P
  : never;

export const getMpaProtectionCoverageStats = (
  params?: GetMpaProtectionCoverageStatsParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal
) => {
  return API<MpaProtectionCoverageStatListResponse>(
    { url: `/mpa-protection-coverage-stats`, method: 'get', params, signal },
    options
  );
};

export const getGetMpaProtectionCoverageStatsQueryKey = (
  params?: GetMpaProtectionCoverageStatsParams
) => {
  return [`/mpa-protection-coverage-stats`, ...(params ? [params] : [])] as const;
};

export const getGetMpaProtectionCoverageStatsQueryOptions = <
  TData = Awaited<ReturnType<typeof getMpaProtectionCoverageStats>>,
  TError = ErrorType<Error>
>(
  params?: GetMpaProtectionCoverageStatsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMpaProtectionCoverageStats>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof API>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMpaProtectionCoverageStatsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMpaProtectionCoverageStats>>> = ({
    signal,
  }) => getMpaProtectionCoverageStats(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getMpaProtectionCoverageStats>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMpaProtectionCoverageStatsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMpaProtectionCoverageStats>>
>;
export type GetMpaProtectionCoverageStatsQueryError = ErrorType<Error>;

export const useGetMpaProtectionCoverageStats = <
  TData = Awaited<ReturnType<typeof getMpaProtectionCoverageStats>>,
  TError = ErrorType<Error>
>(
  params?: GetMpaProtectionCoverageStatsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMpaProtectionCoverageStats>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof API>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetMpaProtectionCoverageStatsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const getMpaProtectionCoverageStatsId = (
  id: number,
  params?: GetMpaProtectionCoverageStatsIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal
) => {
  return API<MpaProtectionCoverageStatResponse>(
    { url: `/mpa-protection-coverage-stats/${id}`, method: 'get', params, signal },
    options
  );
};

export const getGetMpaProtectionCoverageStatsIdQueryKey = (
  id: number,
  params?: GetMpaProtectionCoverageStatsIdParams
) => {
  return [`/mpa-protection-coverage-stats/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetMpaProtectionCoverageStatsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getMpaProtectionCoverageStatsId>>,
  TError = ErrorType<Error>
>(
  id: number,
  params?: GetMpaProtectionCoverageStatsIdParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMpaProtectionCoverageStatsId>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof API>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMpaProtectionCoverageStatsIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMpaProtectionCoverageStatsId>>> = ({
    signal,
  }) => getMpaProtectionCoverageStatsId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getMpaProtectionCoverageStatsId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMpaProtectionCoverageStatsIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMpaProtectionCoverageStatsId>>
>;
export type GetMpaProtectionCoverageStatsIdQueryError = ErrorType<Error>;

export const useGetMpaProtectionCoverageStatsId = <
  TData = Awaited<ReturnType<typeof getMpaProtectionCoverageStatsId>>,
  TError = ErrorType<Error>
>(
  id: number,
  params?: GetMpaProtectionCoverageStatsIdParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMpaProtectionCoverageStatsId>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof API>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetMpaProtectionCoverageStatsIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};
