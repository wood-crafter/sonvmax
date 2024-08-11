/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import { API_ROOT } from "../constant";
import { FetchWithAuthOptions, useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { requestOptions } from "./utils";

export function useMe() {
  const fetcher = useAuthenticatedFetch();
  const { data, isLoading, error, mutate } = useSWR(
    { url: `/auth/me`, fetcher },
    fetchMe
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export async function fetchMe({url, fetcher} : FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions });

  return res.json() as Promise<any>;
}
