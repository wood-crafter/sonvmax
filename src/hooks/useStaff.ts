import useSWR from "swr";
import { API_ROOT } from "../constant";
import type { PagedResponse, RequestOptions, Staff } from "../type";
import {
  FetchWithAuthOptions,
  useAuthenticatedFetch,
} from "./useAuthenticatedFetch";

export const requestOptions: RequestOptions = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export function useStaffs(page: number, size = 20) {
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

export async function fetchStaffs({ url, fetcher }: FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {
    ...requestOptions,
  });

  return res.json() as Promise<PagedResponse<Staff>>;
}
