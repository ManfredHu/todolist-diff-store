import { createAsyncThunk } from '@reduxjs/toolkit';
import { addTodo } from './todoSlice';
import type { RootState } from './store';

export const addTodoWithUser = createAsyncThunk<
  void,
  string,
  { state: RootState }
>('todo/addTodoWithUser', async (text, { getState, dispatch }) => {
  const user = getState().user;
  if (user.loggedIn) {
    dispatch(addTodo({ text, owner: user.name }));
  }
});