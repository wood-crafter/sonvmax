import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AgentInfo, StaffInfo } from "../type";

interface UserState {
  accessToken: string;
  roleName: string;
  level: string;
  id: string;
  setAccessToken: (accessToken: string) => void;
  clear: () => void;
  userInformation: null | AgentInfo | StaffInfo
  setUserInformation: (user: AgentInfo | StaffInfo) => void
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      accessToken: "",
      roleName: "",
      level: "",
      id: '',
      userInformation: null,
      setAccessToken: (accessToken: string) => {
        const payload = accessToken.split(".")[1];
        const roleName = JSON.parse(atob(payload)).roleName;
        const level = JSON.parse(atob(payload)).rank;
        const id = JSON.parse(atob(payload)).sub;

        set(() => ({ roleName, accessToken, level, id }));
      },
      setUserInformation: (user: AgentInfo| StaffInfo) => {
        set(() => ({userInformation: user}))
      },
      clear: () => set({ accessToken: "", roleName: "", level: "", id: "", userInformation: null }),
    }),
    {
      name: "@sonvmax/user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
