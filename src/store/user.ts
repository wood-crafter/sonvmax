import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  accessToken: string;
  roleName: string;
  setAccessToken: (accessToken: string) => void;
  removeAccessToken: () => void;
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      accessToken: "",
      roleName: "",
      setAccessToken: (accessToken: string) => {
        const payload = accessToken.split(".")[1];
        const roleName = JSON.parse(atob(payload)).roleName;

        set(() => ({ roleName, accessToken }));
      },
      removeAccessToken: () => set({ accessToken: "" }),
    }),
    {
      name: "@sonvmax/user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
