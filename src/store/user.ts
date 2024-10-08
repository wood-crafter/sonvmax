import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AgentInfo, Category, StaffInfo } from "../type";

// Type guard to check if the user is an agent
function isAgentInfo(me: AgentInfo | StaffInfo): me is AgentInfo {
  return me?.type === "agent";
}
interface UserState {
  accessToken: string;
  roleName: string;
  level: string;
  id: string;
  categoires: Category[] | null
  setAccessToken: (accessToken: string) => void;
  clear: () => void;
  userInformation: null | AgentInfo | StaffInfo
  setUserInformation: (user: AgentInfo | StaffInfo) => void
  setCategories: (categoires: Category[]) => void
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      accessToken: "",
      roleName: "",
      level: "",
      id: '',
      userInformation: null,
      categoires: null,
      setAccessToken: (accessToken: string) => {
        const payload = accessToken.split(".")[1];
        const roleName = JSON.parse(atob(payload)).roleName;
        const level = JSON.parse(atob(payload)).rank;
        const id = JSON.parse(atob(payload)).sub;

        set(() => ({ roleName, accessToken, level, id }));
      },
      setUserInformation: (user: AgentInfo| StaffInfo) => {
        set(() => ({userInformation: user, level: isAgentInfo(user) ? user.rank + '' : '-1'}))
      },
      setCategories: (categoires) => {
        set(() => ({ categoires }));
      },
      clear: () => set({ accessToken: "", roleName: "", level: "", id: "", userInformation: null }),
    }),
    {
      name: "@sonvmax/user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
