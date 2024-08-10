import useSWR from "swr";
import { API_ROOT } from "../constant";
import type { PagedResponse, Agent } from "../type";
import { FetchWithAuthOptions, useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { requestOptions } from "./utils";

export function useAgents(page: number, size = 9999) {
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
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions });

  return res.json() as Promise<PagedResponse<Agent>>;
}
