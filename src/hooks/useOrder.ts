import useSWR from "swr"
import { API_ROOT } from "../constant"
import { Order, PagedResponse, RequestOptions } from "../type"
import { FetchWithAuthOptions, useAuthenticatedFetch } from "./useAuthenticatedFetch";

export const requestOptions: RequestOptions = {
  method: "GET",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
}

export function useOrders(page = 1, size = 99999) {
  const fetcher = useAuthenticatedFetch();
  const { data, isLoading, error, mutate } = useSWR({ url: `/order/get-order?page=${page}&size=${size}`, fetcher }, fetchOrders)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchOrders({url, fetcher} : FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions})

  return res.json() as Promise<PagedResponse<Order>>
}
