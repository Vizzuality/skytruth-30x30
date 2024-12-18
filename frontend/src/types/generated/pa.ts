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
  PaListResponse,
  Error,
  GetPasParams,
  PaResponse,
  GetPasIdParams,
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

export const getPas = (
  params?: GetPasParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal
) => {
  return API<PaListResponse>({ url: `/pas`, method: 'get', params, signal }, options);
};

export const getGetPasQueryKey = (params?: GetPasParams) => {
  return [`/pas`, ...(params ? [params] : [])] as const;
};

export const getGetPasQueryOptions = <
  TData = Awaited<ReturnType<typeof getPas>>,
  TError = ErrorType<Error>,
>(
  params?: GetPasParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPas>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetPasQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPas>>> = ({ signal }) =>
    getPas(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getPas>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetPasQueryResult = NonNullable<Awaited<ReturnType<typeof getPas>>>;
export type GetPasQueryError = ErrorType<Error>;

export const useGetPas = <TData = Awaited<ReturnType<typeof getPas>>, TError = ErrorType<Error>>(
  params?: GetPasParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPas>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetPasQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const getPasId = (
  id: number,
  params?: GetPasIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal
) => {
  return API<PaResponse>({ url: `/pas/${id}`, method: 'get', params, signal }, options);
};

export const getGetPasIdQueryKey = (id: number, params?: GetPasIdParams) => {
  return [`/pas/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetPasIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getPasId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetPasIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPasId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetPasIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPasId>>> = ({ signal }) =>
    getPasId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getPasId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetPasIdQueryResult = NonNullable<Awaited<ReturnType<typeof getPasId>>>;
export type GetPasIdQueryError = ErrorType<Error>;

export const useGetPasId = <
  TData = Awaited<ReturnType<typeof getPasId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetPasIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPasId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetPasIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};
