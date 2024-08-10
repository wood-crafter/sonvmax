import useSWR from "swr"
import { API_ROOT } from "../constant"
import { PagedResponse, Volume } from "../type"
import { FetchWithAuthOptions, useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { requestOptions } from "./utils";

export function useVolume(page: number, size = 999) {
  const fetcher = useAuthenticatedFetch();
  const { data, isLoading, error, mutate } = useSWR({ url: `/volume?page=${page}&size=${size}`, fetcher }, fetchVolumes)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchVolumes({url, fetcher} : FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions })

  return res.json() as Promise<PagedResponse<Volume>>
}