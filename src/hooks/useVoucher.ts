import useSWR from "swr";
import { API_ROOT } from "../constant";
import type { PagedResponse, Voucher } from "../type";
import {
  FetchWithAuthOptions,
  useAuthenticatedFetch,
} from "./useAuthenticatedFetch";
import { requestOptions } from "./utils";

export function useVouchers(page: number, size = 20) {
  const fetcher = useAuthenticatedFetch();

  const { data, isLoading, error, mutate } = useSWR(
    { url: `/voucher/get-voucher?page=${page}&size=${size}`, fetcher },
    fetchVouchers
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export async function fetchVouchers({ url, fetcher }: FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {
    ...requestOptions,
  });

  return res.json() as Promise<PagedResponse<Voucher>>;
}
