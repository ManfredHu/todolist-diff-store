import { model } from "@modern-js/plugin-state/runtime";

interface UserState {
  name: string;
  loggedIn: boolean;
  loading: boolean;
}

const initialState: UserState = {
  name: '',
  loggedIn: false,
  loading: false,
};

export const usersModel = model<UserState>('users').define((_context, { use }) => ({
  state: initialState,
  actions: {
    changeName: (state, name: string) => {
      state.name = name
    },
    login: (state, name) => {
      state.name = name
      state.loggedIn = true;
    },
    logout: (state) => {
      state.name = '';
      state.loggedIn = false;
    },
    changeLoading: (state, loading: boolean) => {
      state.loading = loading
    }
  },
  effects: {
    async fetchUser() {
      const [, action] = use(usersModel)
      action.changeLoading(true)
      // mock API call
      const user = await getUser() 
      action.changeName(user) 
      action.changeLoading(false)
    },
  },
}));

export const getUser = () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('MockUser');
    }, 1000);
  })
}
