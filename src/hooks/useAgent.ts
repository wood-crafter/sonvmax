import useSWR from "swr";
import { API_ROOT } from "../constant";
import type { PagedResponse, Agent, RequestOptions } from "../type";

export const requestOptions: RequestOptions = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export function useAgents(page: number, size = 20) {
  const { data, isLoading, error, mutate } = useSWR(
    `/agent/get-agent?page=${page}&size=${size}`,
    fetchAgents
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export async function fetchAgents(url: string) {
  const res = await fetch(`${API_ROOT}${url}`, requestOptions);

  return res.json() as Promise<PagedResponse<Agent>>;
}
