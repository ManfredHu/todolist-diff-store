// stores/users.ts
import { atom } from 'jotai';

// 基础状态 atom
export const userNameAtom = atom('');
export const loggedInAtom = atom(false);
export const loadingAtom = atom(false);

// 写函数 atom
export const changeNameAtom = atom(null, (get, set, name: string) => {
  set(userNameAtom, name);
});

export const changeLoadingAtom = atom(null, (get, set, loading: boolean) => {
  set(loadingAtom, loading);
});

export const loginAtom = atom(null, (get, set, name: string) => {
  set(userNameAtom, name);
  set(loggedInAtom, true);
});

export const logoutAtom = atom(null, (get, set) => {
  set(userNameAtom, '');
  set(loggedInAtom, false);
});

// 异步 action atom
export const fetchUserAtom = atom(null, async (get, set) => {
  set(loadingAtom, true);
  const user = await getUser();
  set(userNameAtom, user);
  set(loggedInAtom, true);
  set(loadingAtom, false);
});


// 模拟接口
export const getUser = () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('MockUser');
    }, 1000);
  });
};
