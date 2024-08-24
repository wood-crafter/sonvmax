import useSWR from "swr";
import { API_ROOT } from "../constant";
import type { PagedResponse } from "../type";
import {
  FetchWithAuthOptions,
  useAuthenticatedFetch,
} from "./useAuthenticatedFetch";
import { requestOptions } from "./utils";

export type DashboardData = {
  date: string;
  totalRevenue: {
      date: string;
      totalRevenue: number;
  };
  totalOrders: {
      date: string;
      placed: number;
      completed: number;
      cancelled: number;
  };
  averageOrderValue: {
      date: string;
      averageOrderValue: number;
  };
  totalProductsSold: {
      date: string;
      totalProductsSold: number;
  };
  topSellingProducts: unknown[];
  topAgents: unknown[]; 
}

export function useDashboard(sortBy = 'day', period = 7) {
  const fetcher = useAuthenticatedFetch();

  const { data, isLoading, error, mutate } = useSWR(
    { url: `/dashboard?sortBy=${sortBy}&period=${period}`, fetcher },
    fetchDashboard
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

export async function fetchDashboard({ url, fetcher }: FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {
    ...requestOptions,
  });

  return res.json() as Promise<PagedResponse<DashboardData>>;
}
