/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr"
import { API_ROOT } from "../constant"
import { requestOptions } from "./utils"

export async function fetchColors(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<any>
}

export function useColors() {
  const { data, isLoading, error, mutate } = useSWR(`/color/get-color?page=1&size=99999`, fetchColors)

  return {
    data: data,
    isLoading,
    error,
    mutate,
  }
}