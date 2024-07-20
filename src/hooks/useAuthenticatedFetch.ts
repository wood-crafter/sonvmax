import { useCallback } from "react";
import { useUserStore } from "../store/user";

function useAuthenticationHeaders() {
  const accessToken = useUserStore((state) => state.accessToken);

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export type AuthenticatedFetch = typeof fetch;

export type FetchWithAuthOptions = {
  url: string;
  init?: RequestInit;
  fetcher: AuthenticatedFetch;
};

export function useAuthenticatedFetch(): AuthenticatedFetch {
  const authHeaders = useAuthenticationHeaders();

  return useCallback(
    (input: RequestInfo | URL, init: RequestInit = {}) => {
      return fetch(input, {
        ...init,
        headers: {
          ...authHeaders,
          ...init.headers,
        },
      });
    },
    [authHeaders.Authorization]
  );
}
