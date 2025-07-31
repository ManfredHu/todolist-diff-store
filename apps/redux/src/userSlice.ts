import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getUser = () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('MockUser');
    }, 1000);
  })
}

// 模拟异步请求（1s 后返回 mock 用户）
export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  return getUser();
});

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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.loggedIn = true;
    },
    logout: (state) => {
      state.name = '';
      state.loggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.name = action.payload;
        state.loggedIn = true;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
