import useSWRMutation from "swr/mutation"
import { API_ROOT } from "../constant"
import { LoginBody } from "../type"

export async function fetchLogin(url: string, { arg: body }: { arg: LoginBody }) {
  const res = await fetch(`${API_ROOT}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  })

  return res.json() as Promise<{
    message: string
    accessToken: string
  }>
}

export function useLogin() {
  const { data, error, trigger } = useSWRMutation('/auth/login', fetchLogin)

  return {
    data,
    error,
    trigger,
  }
}