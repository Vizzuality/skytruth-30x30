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
  MpaListResponse,
  Error,
  GetMpasParams,
  MpaResponse,
  GetMpasIdParams,
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

export const getMpas = (
  params?: GetMpasParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal
) => {
  return API<MpaListResponse>({ url: `/mpas`, method: 'get', params, signal }, options);
};

export const getGetMpasQueryKey = (params?: GetMpasParams) => {
  return [`/mpas`, ...(params ? [params] : [])] as const;
};

export const getGetMpasQueryOptions = <
  TData = Awaited<ReturnType<typeof getMpas>>,
  TError = ErrorType<Error>
>(
  params?: GetMpasParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMpas>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMpasQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMpas>>> = ({ signal }) =>
    getMpas(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getMpas>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMpasQueryResult = NonNullable<Awaited<ReturnType<typeof getMpas>>>;
export type GetMpasQueryError = ErrorType<Error>;

export const useGetMpas = <TData = Awaited<ReturnType<typeof getMpas>>, TError = ErrorType<Error>>(
  params?: GetMpasParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMpas>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetMpasQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const getMpasId = (
  id: number,
  params?: GetMpasIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal
) => {
  return API<MpaResponse>({ url: `/mpas/${id}`, method: 'get', params, signal }, options);
};

export const getGetMpasIdQueryKey = (id: number, params?: GetMpasIdParams) => {
  return [`/mpas/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetMpasIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getMpasId>>,
  TError = ErrorType<Error>
>(
  id: number,
  params?: GetMpasIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMpasId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMpasIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMpasId>>> = ({ signal }) =>
    getMpasId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getMpasId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMpasIdQueryResult = NonNullable<Awaited<ReturnType<typeof getMpasId>>>;
export type GetMpasIdQueryError = ErrorType<Error>;

export const useGetMpasId = <
  TData = Awaited<ReturnType<typeof getMpasId>>,
  TError = ErrorType<Error>
>(
  id: number,
  params?: GetMpasIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMpasId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetMpasIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};
