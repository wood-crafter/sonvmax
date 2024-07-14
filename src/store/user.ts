import { create } from 'zustand'

interface UserState {
  accessToken: string
  roleName: string
  setRoleName: (nextRole: string) => void
  setAccessToken: (token: string) => void
  removeAccessToken: () => void
}

export const useUserStore = create<UserState>((set) => ({
  accessToken: '',
  roleName: '',
  setRoleName: (nextRole) => set(() => ({ roleName: nextRole })),
  setAccessToken: (token: string) => set(() => ({ accessToken: token })),
  removeAccessToken: () => set({ accessToken: '' }),
}))