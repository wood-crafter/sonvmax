/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ROOT } from "../constant";
import { FetchWithAuthOptions, useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { requestOptions } from "./utils";
import useSWRMutation from "swr/mutation";

export function useMeMutation() {
  const fetcher = useAuthenticatedFetch();
  const { data, error, trigger } = useSWRMutation({ url: `/auth/me`, fetcher }, fetchMe)

  return {
    data,
    error,
    trigger,
  }
}

export async function fetchMe({url, fetcher} : FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`, {...requestOptions });

  return res.json() as Promise<any>;
}
