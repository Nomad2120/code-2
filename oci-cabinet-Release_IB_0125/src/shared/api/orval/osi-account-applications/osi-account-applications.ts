/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * OSI.Core
 * OpenAPI spec version: v1
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';
import type {
  ApiResponse,
  ApiResponse1OSICoreModelsDbOsiAccountApplication,
  ApiResponse1OSICoreModelsDbOsiAccountApplicationDoc,
  ApiResponse1SystemCollectionsGenericIEnumerable1OSICoreModelsDbOsiAccountApplicationDoc,
  RequestsAddScanDoc,
  RequestsOsiAccountApplicationCheckRequest,
  RequestsOsiAccountApplicationRequest
} from '.././models';
import { axiosForReactQueryInstance } from '../../reactQuery';
import type { ErrorType, BodyType } from '../../reactQuery';

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

/**
 * @summary Получить заявку по идентификатору
 */
export const getApiOsiAccountApplicationsId = (
  id: number,
  options?: SecondParameter<typeof axiosForReactQueryInstance>,
  signal?: AbortSignal
) => {
  return axiosForReactQueryInstance<ApiResponse1OSICoreModelsDbOsiAccountApplication>(
    { url: `/api/OsiAccountApplications/${id}`, method: 'GET', signal },
    options
  );
};

export const getGetApiOsiAccountApplicationsIdQueryKey = (id: number) => {
  return [`/api/OsiAccountApplications/${id}`] as const;
};

export const getGetApiOsiAccountApplicationsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>,
  TError = ErrorType<unknown>
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>, TError, TData>>;
    request?: SecondParameter<typeof axiosForReactQueryInstance>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetApiOsiAccountApplicationsIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>> = ({ signal }) =>
    getApiOsiAccountApplicationsId(id, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetApiOsiAccountApplicationsIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>
>;
export type GetApiOsiAccountApplicationsIdQueryError = ErrorType<unknown>;

export function useGetApiOsiAccountApplicationsId<
  TData = Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>,
  TError = ErrorType<unknown>
>(
  id: number,
  options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>, TError, TData>> &
      Pick<
        DefinedInitialDataOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>, TError, TData>,
        'initialData'
      >;
    request?: SecondParameter<typeof axiosForReactQueryInstance>;
  }
): DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetApiOsiAccountApplicationsId<
  TData = Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>,
  TError = ErrorType<unknown>
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>, TError, TData>> &
      Pick<
        UndefinedInitialDataOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>, TError, TData>,
        'initialData'
      >;
    request?: SecondParameter<typeof axiosForReactQueryInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetApiOsiAccountApplicationsId<
  TData = Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>,
  TError = ErrorType<unknown>
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>, TError, TData>>;
    request?: SecondParameter<typeof axiosForReactQueryInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
/**
 * @summary Получить заявку по идентификатору
 */

export function useGetApiOsiAccountApplicationsId<
  TData = Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>,
  TError = ErrorType<unknown>
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsId>>, TError, TData>>;
    request?: SecondParameter<typeof axiosForReactQueryInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetApiOsiAccountApplicationsIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * @summary Получить документы заявки по идентификатору
 */
export const getApiOsiAccountApplicationsIdDocs = (
  id: number,
  options?: SecondParameter<typeof axiosForReactQueryInstance>,
  signal?: AbortSignal
) => {
  return axiosForReactQueryInstance<ApiResponse1SystemCollectionsGenericIEnumerable1OSICoreModelsDbOsiAccountApplicationDoc>(
    { url: `/api/OsiAccountApplications/${id}/docs`, method: 'GET', signal },
    options
  );
};

export const getGetApiOsiAccountApplicationsIdDocsQueryKey = (id: number) => {
  return [`/api/OsiAccountApplications/${id}/docs`] as const;
};

export const getGetApiOsiAccountApplicationsIdDocsQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>,
  TError = ErrorType<unknown>
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>, TError, TData>>;
    request?: SecondParameter<typeof axiosForReactQueryInstance>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetApiOsiAccountApplicationsIdDocsQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>> = ({ signal }) =>
    getApiOsiAccountApplicationsIdDocs(id, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetApiOsiAccountApplicationsIdDocsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>
>;
export type GetApiOsiAccountApplicationsIdDocsQueryError = ErrorType<unknown>;

export function useGetApiOsiAccountApplicationsIdDocs<
  TData = Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>,
  TError = ErrorType<unknown>
>(
  id: number,
  options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>, TError, TData>> &
      Pick<
        DefinedInitialDataOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>, TError, TData>,
        'initialData'
      >;
    request?: SecondParameter<typeof axiosForReactQueryInstance>;
  }
): DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetApiOsiAccountApplicationsIdDocs<
  TData = Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>,
  TError = ErrorType<unknown>
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>, TError, TData>> &
      Pick<
        UndefinedInitialDataOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>, TError, TData>,
        'initialData'
      >;
    request?: SecondParameter<typeof axiosForReactQueryInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetApiOsiAccountApplicationsIdDocs<
  TData = Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>,
  TError = ErrorType<unknown>
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>, TError, TData>>;
    request?: SecondParameter<typeof axiosForReactQueryInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
/**
 * @summary Получить документы заявки по идентификатору
 */

export function useGetApiOsiAccountApplicationsIdDocs<
  TData = Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>,
  TError = ErrorType<unknown>
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiOsiAccountApplicationsIdDocs>>, TError, TData>>;
    request?: SecondParameter<typeof axiosForReactQueryInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetApiOsiAccountApplicationsIdDocsQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * @summary Прикрепить документ
 */
export const postApiOsiAccountApplicationsIdDocs = (
  id: number,
  requestsAddScanDoc: BodyType<RequestsAddScanDoc>,
  options?: SecondParameter<typeof axiosForReactQueryInstance>,
  signal?: AbortSignal
) => {
  return axiosForReactQueryInstance<ApiResponse1OSICoreModelsDbOsiAccountApplicationDoc>(
    {
      url: `/api/OsiAccountApplications/${id}/docs`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: requestsAddScanDoc,
      signal
    },
    options
  );
};

export const getPostApiOsiAccountApplicationsIdDocsMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiOsiAccountApplicationsIdDocs>>,
    TError,
    { id: number; data: BodyType<RequestsAddScanDoc> },
    TContext
  >;
  request?: SecondParameter<typeof axiosForReactQueryInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postApiOsiAccountApplicationsIdDocs>>,
  TError,
  { id: number; data: BodyType<RequestsAddScanDoc> },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postApiOsiAccountApplicationsIdDocs>>,
    { id: number; data: BodyType<RequestsAddScanDoc> }
  > = (props) => {
    const { id, data } = props ?? {};

    return postApiOsiAccountApplicationsIdDocs(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostApiOsiAccountApplicationsIdDocsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postApiOsiAccountApplicationsIdDocs>>
>;
export type PostApiOsiAccountApplicationsIdDocsMutationBody = BodyType<RequestsAddScanDoc>;
export type PostApiOsiAccountApplicationsIdDocsMutationError = ErrorType<unknown>;

/**
 * @summary Прикрепить документ
 */
export const usePostApiOsiAccountApplicationsIdDocs = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiOsiAccountApplicationsIdDocs>>,
    TError,
    { id: number; data: BodyType<RequestsAddScanDoc> },
    TContext
  >;
  request?: SecondParameter<typeof axiosForReactQueryInstance>;
}): UseMutationResult<
  Awaited<ReturnType<typeof postApiOsiAccountApplicationsIdDocs>>,
  TError,
  { id: number; data: BodyType<RequestsAddScanDoc> },
  TContext
> => {
  const mutationOptions = getPostApiOsiAccountApplicationsIdDocsMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Проверить есть ли активная заявка
 */
export const postApiOsiAccountApplicationsCheck = (
  requestsOsiAccountApplicationCheckRequest: BodyType<RequestsOsiAccountApplicationCheckRequest>,
  options?: SecondParameter<typeof axiosForReactQueryInstance>,
  signal?: AbortSignal
) => {
  return axiosForReactQueryInstance<ApiResponse>(
    {
      url: `/api/OsiAccountApplications/check`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: requestsOsiAccountApplicationCheckRequest,
      signal
    },
    options
  );
};

export const getPostApiOsiAccountApplicationsCheckMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiOsiAccountApplicationsCheck>>,
    TError,
    { data: BodyType<RequestsOsiAccountApplicationCheckRequest> },
    TContext
  >;
  request?: SecondParameter<typeof axiosForReactQueryInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postApiOsiAccountApplicationsCheck>>,
  TError,
  { data: BodyType<RequestsOsiAccountApplicationCheckRequest> },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postApiOsiAccountApplicationsCheck>>,
    { data: BodyType<RequestsOsiAccountApplicationCheckRequest> }
  > = (props) => {
    const { data } = props ?? {};

    return postApiOsiAccountApplicationsCheck(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostApiOsiAccountApplicationsCheckMutationResult = NonNullable<
  Awaited<ReturnType<typeof postApiOsiAccountApplicationsCheck>>
>;
export type PostApiOsiAccountApplicationsCheckMutationBody = BodyType<RequestsOsiAccountApplicationCheckRequest>;
export type PostApiOsiAccountApplicationsCheckMutationError = ErrorType<unknown>;

/**
 * @summary Проверить есть ли активная заявка
 */
export const usePostApiOsiAccountApplicationsCheck = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiOsiAccountApplicationsCheck>>,
    TError,
    { data: BodyType<RequestsOsiAccountApplicationCheckRequest> },
    TContext
  >;
  request?: SecondParameter<typeof axiosForReactQueryInstance>;
}): UseMutationResult<
  Awaited<ReturnType<typeof postApiOsiAccountApplicationsCheck>>,
  TError,
  { data: BodyType<RequestsOsiAccountApplicationCheckRequest> },
  TContext
> => {
  const mutationOptions = getPostApiOsiAccountApplicationsCheckMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Подать заявку
 */
export const postApiOsiAccountApplications = (
  requestsOsiAccountApplicationRequest: BodyType<RequestsOsiAccountApplicationRequest>,
  options?: SecondParameter<typeof axiosForReactQueryInstance>,
  signal?: AbortSignal
) => {
  return axiosForReactQueryInstance<ApiResponse1OSICoreModelsDbOsiAccountApplication>(
    {
      url: `/api/OsiAccountApplications`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: requestsOsiAccountApplicationRequest,
      signal
    },
    options
  );
};

export const getPostApiOsiAccountApplicationsMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiOsiAccountApplications>>,
    TError,
    { data: BodyType<RequestsOsiAccountApplicationRequest> },
    TContext
  >;
  request?: SecondParameter<typeof axiosForReactQueryInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postApiOsiAccountApplications>>,
  TError,
  { data: BodyType<RequestsOsiAccountApplicationRequest> },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postApiOsiAccountApplications>>,
    { data: BodyType<RequestsOsiAccountApplicationRequest> }
  > = (props) => {
    const { data } = props ?? {};

    return postApiOsiAccountApplications(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostApiOsiAccountApplicationsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postApiOsiAccountApplications>>
>;
export type PostApiOsiAccountApplicationsMutationBody = BodyType<RequestsOsiAccountApplicationRequest>;
export type PostApiOsiAccountApplicationsMutationError = ErrorType<unknown>;

/**
 * @summary Подать заявку
 */
export const usePostApiOsiAccountApplications = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiOsiAccountApplications>>,
    TError,
    { data: BodyType<RequestsOsiAccountApplicationRequest> },
    TContext
  >;
  request?: SecondParameter<typeof axiosForReactQueryInstance>;
}): UseMutationResult<
  Awaited<ReturnType<typeof postApiOsiAccountApplications>>,
  TError,
  { data: BodyType<RequestsOsiAccountApplicationRequest> },
  TContext
> => {
  const mutationOptions = getPostApiOsiAccountApplicationsMutationOptions(options);

  return useMutation(mutationOptions);
};
