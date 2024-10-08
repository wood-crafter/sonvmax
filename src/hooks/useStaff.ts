import useSWR from "swr";
import { API_ROOT } from "../constant";
import type { PagedResponse, Sales, Staff } from "../type";
import {
  FetchWithAuthOptions,
  useAuthenticatedFetch,
} from "./useAuthenticatedFetch";
import { requestOptions } from "./utils";

export function useStaffs(page: number, size = 9999) {
  const fetcher = useAuthenticatedFetch();

  const { data, isLoading, error, mutate } = useSWR(
    { url: `/staff/get-staff?page=${page}&size=${size}`, fetcher },
    fetchStaffs
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export function useSales(page: number, size = 9999) {
  const fetcher = useAuthenticatedFetch();

  const { data, isLoading, error, mutate } = useSWR(
    { url: `/staff/get-sales-staff?page=${page}&size=${size}`, fetcher },
    fetchSales
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export async function fetchSales({ url, fetcher }: FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {
    ...requestOptions,
  });

  return res.json() as Promise<PagedResponse<Sales>>;
}

export async function fetchStaffs({ url, fetcher }: FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {
    ...requestOptions,
  });

  return res.json() as Promise<PagedResponse<Staff>>;
}
