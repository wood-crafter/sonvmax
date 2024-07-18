import useSWR from "swr"
import { API_ROOT } from "../constant"
import { PagedResponse, Color } from "../type"
import { requestOptions } from "./useProduct"

export async function fetchColors(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<PagedResponse<Color>>
}

export function useColors() {
  const { data, isLoading, error, mutate } = useSWR(`/color/get-color`, fetchColors)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}