import { create } from "zustand";

export type State = {
  name: string;
  loggedIn: boolean;
  loading: boolean;
  changeName: (name: string) => void;
  changeLoading: (loading: boolean) => void;
  login: (name: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<State>((set, get) => ({
  name: "",
  loggedIn: false,
  loading: false,

  changeName: (name: string) => set({ name }),
  login: (name: string) => set({ name, loggedIn: true }),
  logout: () => set({ name: "", loggedIn: false }),
  changeLoading: (loading: boolean) => set({ loading }),
  fetchUser: async () => {
    const { changeLoading, login } = get()
    changeLoading(true)
    const user = await getUser()
    login(user)
    changeLoading(false)
  },
}))

export const getUser = () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('MockUser');
    }, 1000);
  })
}