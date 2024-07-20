import useSWR from "swr";
import { API_ROOT } from "../constant";
import { PagedResponse, Role } from "../type";
import {
  FetchWithAuthOptions,
  useAuthenticatedFetch,
} from "./useAuthenticatedFetch";

export function useRoles(page: number, size = 20) {
  const authedFetch = useAuthenticatedFetch();

  const { data, isLoading, error, mutate } = useSWR(
    { url: `/role/get-role?page=${page}&size=${size}`, fetcher: authedFetch },
    fetchRoles
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export async function fetchRoles({ url, fetcher }: FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`);

  return res.json() as Promise<PagedResponse<Role>>;
}
