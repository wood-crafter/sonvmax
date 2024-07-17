import { useCallback } from "react"
import { useUserStore } from "../store/user"

function useAuthenticationHeaders() {
  const accessToken = useUserStore((state) => state.accessToken)

  return {
    'Authentication': `Bearer ${accessToken}`
  }
}

export function useAuthenticatedFetch() {
  const authHeaders = useAuthenticationHeaders()

  return useCallback((input: RequestInfo | URL, init: RequestInit) => {
    return fetch(input, {
      ...init,
      headers: {
        'Authentication': `${authHeaders.Authentication}`,
        ...init.headers
      }
    })
  }, [authHeaders.Authentication])
}
