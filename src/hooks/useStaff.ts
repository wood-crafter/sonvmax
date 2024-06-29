import useSWR from "swr"
import { API_ROOT } from "../constant"
import { Role, PagedResponse, Staff, RequestOptions } from "../type"

export const requestOptions: RequestOptions = {
  method: "GET",
  headers: {
    "Access-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbklkIjoidGFrYWhpcm8ubWl5YW1vdG9Abm9yaXRzdS5jb20iLCJyb2xlIjowLCJsb2dpbkluZm9JZCI6MjgsImN1c3RvbWVySWQiOjY4LCJzdG9yZUNvZGUiOiJNaXlhbW90byIsImlhdCI6MTcxODMyNTI2MiwiZXhwIjoxNzE4NDExNjYyfQ.Qb8cpuRO6ZyPaHXIznrJq1HqmmkLLdhG9LHC0C9otcs"
  }
}

export function useRoles(page: number, size = 20) {
  const { data, isLoading, error, mutate } = useSWR(`/role/get-role?page=${page}&size=${size}`, fetchRoles)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchRoles(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<PagedResponse<Role>>
}

export function useStaffs(page: number, size = 20) {
  const { data, isLoading, error, mutate } = useSWR(`/staff/get-staff?page=${page}&size=${size}`, fetchStaffs)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchStaffs(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<PagedResponse<Staff>>
}

export async function updateStaff(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Staff>
}

export async function deleteStaff(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Staff>
}

export async function addStaff(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Staff>
}