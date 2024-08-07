import useSWR from "swr";
import { API_ROOT } from "../constant";
import type { PagedResponse, Agent, RequestOptions } from "../type";
import { FetchWithAuthOptions, useAuthenticatedFetch } from "./useAuthenticatedFetch";

export const requestOptions: RequestOptions = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export function useAgents(page: number, size = 20) {
  const fetcher = useAuthenticatedFetch();
  const { data, isLoading, error, mutate } = useSWR(
    { url: `/agent/get-agent?page=${page}&size=${size}`, fetcher },
    fetchAgents
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export function useAgentById(id: string) {
  const fetcher = useAuthenticatedFetch();
  const { data, isLoading, error, mutate } = useSWR(
    { url: `/agent/get-agent/${id}`, fetcher },
    fetchAgents
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export async function fetchAgents({url, fetcher} : FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions});

  return res.json() as Promise<PagedResponse<Agent>>;
}
