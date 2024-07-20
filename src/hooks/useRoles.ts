import useSWR from "swr";
import { API_ROOT } from "../constant";
import { PagedResponse, Role } from "../type";
import {
  FetchWithAuthOptions,
  useAuthenticatedFetch,
} from "./useAuthenticatedFetch";
import useSWRMutation from "swr/mutation";

export function useRoles(page: number, size = 20) {
  const authedFetch = useAuthenticatedFetch();

  const { data, isLoading, error, mutate } = useSWR(
    { url: `/role/get-role?page=${page}&size=${size}`, fetcher: authedFetch },
    fetchRoles
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}

async function fetchRoles({ url, fetcher }: FetchWithAuthOptions) {
  const res = await fetcher(`${API_ROOT}${url}`);

  return res.json() as Promise<PagedResponse<Role>>;
}

export function useCreateRole() {
  const fetcher = useAuthenticatedFetch();
  const { trigger } = useSWRMutation(
    { fetcher, url: "/role/create-role" },
    createRole
  );

  return { trigger };
}

async function createRole(
  { url, fetcher }: FetchWithAuthOptions,
  { arg }: { arg: { roleName: string } }
) {
  const res = await fetcher(`${API_ROOT}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: arg.roleName,
    }),
  });

  return res.json();
}

export function useDeleteRole() {
  const fetcher = useAuthenticatedFetch();

  return useSWRMutation({ fetcher, url: "/role/remove-role" }, deleteRole);
}

async function deleteRole(
  { url, fetcher }: FetchWithAuthOptions,
  { arg }: { arg: { id: string } }
) {
  const res = await fetcher(`${API_ROOT}${url}/${arg.id}`, {
    method: "DELETE",
  });

  return res.json();
}
