import useSWR from "swr";
import { API_ROOT } from "../constant";
import type { PagedResponse, Transaction } from "../type";
import {
  FetchWithAuthOptions,
  useAuthenticatedFetch,
} from "./useAuthenticatedFetch";
import { requestOptions } from "./utils";

export function useTransaction(page: number, size = 9999) {
  const fetcher = useAuthenticatedFetch();

  const { data, isLoading, error, mutate } = useSWR(
    { url: `/transaction/get-transaction?page=${page}&size=${size}`, fetcher },
    fetchTransaction
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export async function fetchTransaction({ url, fetcher }: FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {
    ...requestOptions,
  });

  return res.json() as Promise<PagedResponse<Transaction>>;
}