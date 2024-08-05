import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  accessToken: string;
  roleName: string;
  level: string;
  setAccessToken: (accessToken: string) => void;
  clear: () => void;
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      accessToken: "",
      roleName: "",
      level: "",
      setAccessToken: (accessToken: string) => {
        const payload = accessToken.split(".")[1];
        const roleName = JSON.parse(atob(payload)).roleName;
        const level = JSON.parse(atob(payload)).level;

        set(() => ({ roleName, accessToken, level }));
      },
      clear: () => set({ accessToken: "", roleName: "", level: "" }),
    }),
    {
      name: "@sonvmax/user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
