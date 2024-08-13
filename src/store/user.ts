import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AgentInfo, StaffInfo } from "../type";
import { useMeMutation } from "../hooks/useMe";

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
const { trigger: triggerMe } = useMeMutation();

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      accessToken: "",
      roleName: "",
      level: "",
      id: '',
      userInformation: null,
      setAccessToken: async (accessToken: string) => {
        const payload = accessToken.split(".")[1];
        const roleName = JSON.parse(atob(payload)).roleName;
        const level = JSON.parse(atob(payload)).rank;
        const id = JSON.parse(atob(payload)).sub;
        const me = await triggerMe();

        set(() => ({ roleName, accessToken, level, id, userInformation: me }));
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
