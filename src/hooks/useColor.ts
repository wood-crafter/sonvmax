import useSWR from "swr"
import { API_ROOT } from "../constant"
import { ParentColor } from "../type"
import { requestOptions } from "./useProduct"

export async function fetchColors(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<{ colors: ParentColor[] }>
}

export function useColors() {
  const { data, isLoading, error, mutate } = useSWR(`/color/get-color`, fetchColors)

  return {
    data: data,
    isLoading,
    error,
    mutate,
  }
}