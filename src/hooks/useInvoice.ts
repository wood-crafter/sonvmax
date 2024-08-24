import useSWR from "swr"
import { API_ROOT } from "../constant"
import { Invoice, PagedResponse } from "../type"
import { requestOptions } from "./utils";
import { FetchWithAuthOptions, useAuthenticatedFetch } from "./useAuthenticatedFetch";

export function useInvoices(page: number, size = 99999) {
  const fetcher = useAuthenticatedFetch();
  const url = `/invoice/?page=${page}&size=${size}`
  const { data, isLoading, error, mutate } = useSWR({url, fetcher}, fetchInvoices)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchInvoices({url, fetcher} : FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions })

  return res.json() as Promise<PagedResponse<Invoice>>
}
