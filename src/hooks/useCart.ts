import useSWR from "swr";
import { FetchWithAuthOptions, useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { API_ROOT } from "../constant";
import { Cart, PagedResponse } from "../type";
import { requestOptions } from "./utils";

export function useCart() {
  const fetcher = useAuthenticatedFetch();
  const { data, isLoading, error, mutate } = useSWR({ url: `/order/get-order-product`, fetcher }, fetchCart)

  return {
    data: data?.data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchCart({url, fetcher} : FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions })

  return res.json() as Promise<PagedResponse<Cart>>
}
