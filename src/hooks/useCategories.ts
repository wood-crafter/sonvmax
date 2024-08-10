import useSWR from "swr";
import { API_ROOT } from "../constant";
import { PagedResponse, Category } from "../type";
import {
  FetchWithAuthOptions,
  useAuthenticatedFetch,
} from "./useAuthenticatedFetch";
import { requestOptions } from "./utils";

export function useCategories(page: number, size = 999) {
  const fetcher = useAuthenticatedFetch();
  const { data, isLoading, error, mutate } = useSWR({ url: `/category/get-category?page=${page}&size=${size}`, fetcher }, fetchCategories)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchCategories({url, fetcher} : FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions})

  return res.json() as Promise<PagedResponse<Category>>
}
