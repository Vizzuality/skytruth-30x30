/**
 * Generated by orval v6.18.1 🍺
 * Do not edit manually.
 * DOCUMENTATION
 * OpenAPI spec version: 1.0.0
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import type {
  EnvironmentListResponse,
  Error,
  GetEnvironmentsParams,
  EnvironmentResponse,
  EnvironmentRequest,
  GetEnvironmentsIdParams,
  EnvironmentLocalizationResponse,
  EnvironmentLocalizationRequest,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType, BodyType } from '../../services/api/index';

// eslint-disable-next-line
type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P
) => any
  ? P
  : never;

export const getEnvironments = (
  params?: GetEnvironmentsParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal
) => {
  return API<EnvironmentListResponse>(
    { url: `/environments`, method: 'get', params, signal },
    options
  );
};

export const getGetEnvironmentsQueryKey = (params?: GetEnvironmentsParams) => {
  return [`/environments`, ...(params ? [params] : [])] as const;
};

export const getGetEnvironmentsQueryOptions = <
  TData = Awaited<ReturnType<typeof getEnvironments>>,
  TError = ErrorType<Error>,
>(
  params?: GetEnvironmentsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getEnvironments>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetEnvironmentsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getEnvironments>>> = ({ signal }) =>
    getEnvironments(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getEnvironments>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetEnvironmentsQueryResult = NonNullable<Awaited<ReturnType<typeof getEnvironments>>>;
export type GetEnvironmentsQueryError = ErrorType<Error>;

export const useGetEnvironments = <
  TData = Awaited<ReturnType<typeof getEnvironments>>,
  TError = ErrorType<Error>,
>(
  params?: GetEnvironmentsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getEnvironments>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetEnvironmentsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postEnvironments = (
  environmentRequest: BodyType<EnvironmentRequest>,
  options?: SecondParameter<typeof API>
) => {
  return API<EnvironmentResponse>(
    {
      url: `/environments`,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: environmentRequest,
    },
    options
  );
};

export const getPostEnvironmentsMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postEnvironments>>,
    TError,
    { data: BodyType<EnvironmentRequest> },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postEnvironments>>,
  TError,
  { data: BodyType<EnvironmentRequest> },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postEnvironments>>,
    { data: BodyType<EnvironmentRequest> }
  > = (props) => {
    const { data } = props ?? {};

    return postEnvironments(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostEnvironmentsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postEnvironments>>
>;
export type PostEnvironmentsMutationBody = BodyType<EnvironmentRequest>;
export type PostEnvironmentsMutationError = ErrorType<Error>;

export const usePostEnvironments = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postEnvironments>>,
    TError,
    { data: BodyType<EnvironmentRequest> },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostEnvironmentsMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getEnvironmentsId = (
  id: number,
  params?: GetEnvironmentsIdParams,
  options?: SecondParameter<typeof API>,
  signal?: AbortSignal
) => {
  return API<EnvironmentResponse>(
    { url: `/environments/${id}`, method: 'get', params, signal },
    options
  );
};

export const getGetEnvironmentsIdQueryKey = (id: number, params?: GetEnvironmentsIdParams) => {
  return [`/environments/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetEnvironmentsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getEnvironmentsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetEnvironmentsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getEnvironmentsId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetEnvironmentsIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getEnvironmentsId>>> = ({ signal }) =>
    getEnvironmentsId(id, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getEnvironmentsId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetEnvironmentsIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getEnvironmentsId>>
>;
export type GetEnvironmentsIdQueryError = ErrorType<Error>;

export const useGetEnvironmentsId = <
  TData = Awaited<ReturnType<typeof getEnvironmentsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetEnvironmentsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getEnvironmentsId>>, TError, TData>;
    request?: SecondParameter<typeof API>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetEnvironmentsIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putEnvironmentsId = (
  id: number,
  environmentRequest: BodyType<EnvironmentRequest>,
  options?: SecondParameter<typeof API>
) => {
  return API<EnvironmentResponse>(
    {
      url: `/environments/${id}`,
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      data: environmentRequest,
    },
    options
  );
};

export const getPutEnvironmentsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putEnvironmentsId>>,
    TError,
    { id: number; data: BodyType<EnvironmentRequest> },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putEnvironmentsId>>,
  TError,
  { id: number; data: BodyType<EnvironmentRequest> },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putEnvironmentsId>>,
    { id: number; data: BodyType<EnvironmentRequest> }
  > = (props) => {
    const { id, data } = props ?? {};

    return putEnvironmentsId(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutEnvironmentsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putEnvironmentsId>>
>;
export type PutEnvironmentsIdMutationBody = BodyType<EnvironmentRequest>;
export type PutEnvironmentsIdMutationError = ErrorType<Error>;

export const usePutEnvironmentsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putEnvironmentsId>>,
    TError,
    { id: number; data: BodyType<EnvironmentRequest> },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPutEnvironmentsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteEnvironmentsId = (id: number, options?: SecondParameter<typeof API>) => {
  return API<number>({ url: `/environments/${id}`, method: 'delete' }, options);
};

export const getDeleteEnvironmentsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteEnvironmentsId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteEnvironmentsId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteEnvironmentsId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteEnvironmentsId(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteEnvironmentsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteEnvironmentsId>>
>;

export type DeleteEnvironmentsIdMutationError = ErrorType<Error>;

export const useDeleteEnvironmentsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteEnvironmentsId>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getDeleteEnvironmentsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const postEnvironmentsIdLocalizations = (
  id: number,
  environmentLocalizationRequest: BodyType<EnvironmentLocalizationRequest>,
  options?: SecondParameter<typeof API>
) => {
  return API<EnvironmentLocalizationResponse>(
    {
      url: `/environments/${id}/localizations`,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: environmentLocalizationRequest,
    },
    options
  );
};

export const getPostEnvironmentsIdLocalizationsMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postEnvironmentsIdLocalizations>>,
    TError,
    { id: number; data: BodyType<EnvironmentLocalizationRequest> },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postEnvironmentsIdLocalizations>>,
  TError,
  { id: number; data: BodyType<EnvironmentLocalizationRequest> },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postEnvironmentsIdLocalizations>>,
    { id: number; data: BodyType<EnvironmentLocalizationRequest> }
  > = (props) => {
    const { id, data } = props ?? {};

    return postEnvironmentsIdLocalizations(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostEnvironmentsIdLocalizationsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postEnvironmentsIdLocalizations>>
>;
export type PostEnvironmentsIdLocalizationsMutationBody = BodyType<EnvironmentLocalizationRequest>;
export type PostEnvironmentsIdLocalizationsMutationError = ErrorType<Error>;

export const usePostEnvironmentsIdLocalizations = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postEnvironmentsIdLocalizations>>,
    TError,
    { id: number; data: BodyType<EnvironmentLocalizationRequest> },
    TContext
  >;
  request?: SecondParameter<typeof API>;
}) => {
  const mutationOptions = getPostEnvironmentsIdLocalizationsMutationOptions(options);

  return useMutation(mutationOptions);
};
