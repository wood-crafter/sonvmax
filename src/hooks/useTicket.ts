import useSWR from "swr"
import { API_ROOT } from "../constant"
import { Ticket, PagedResponse } from "../type"
import { requestOptions } from "./utils";
import { FetchWithAuthOptions, useAuthenticatedFetch } from "./useAuthenticatedFetch";

export function useTickets(page: number, size = 9999) {
  const fetcher = useAuthenticatedFetch();
  const url = `/ticket/?page=${page}&size=${size}`
  const { data, isLoading, error, mutate } = useSWR({url, fetcher}, fetchTickets)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchTickets({url, fetcher} : FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions })

  return res.json() as Promise<PagedResponse<Ticket>>
}
