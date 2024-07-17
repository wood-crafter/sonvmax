import { create } from 'zustand'

interface UserState {
  accessToken: string
  roleName: string
  setAccessToken: (token: string) => void
  removeAccessToken: () => void
}

export const useUserStore = create<UserState>((set) => ({
  accessToken: '',
  roleName: '',
  setAccessToken: (token: string) => {
    set(() => ({ accessToken: token }))
    const payload = token.split('.')[1]
    const roleName = JSON.parse(atob(payload)).roleName
    set(() => ({ roleName: roleName }))
  },
  removeAccessToken: () => set({ accessToken: '' }),
}))