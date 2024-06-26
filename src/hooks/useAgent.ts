import useSWR from "swr"
import { API_ROOT } from "../constant"
import { Role, PagedResponse, Agent, RequestOptions } from "../type"

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

export function useAgents(page: number, size = 20) {
  const { data, isLoading, error, mutate } = useSWR(`/agent/get-agent?page=${page}&size=${size}`, fetchAgents)

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export async function fetchAgents(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<PagedResponse<Agent>>
}

export async function updateAgent(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Agent>
}

export async function deleteAgent(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Agent>
}

export async function addAgent(url: string, requestOptions: RequestOptions) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions)

  return res.json() as Promise<Agent>
}