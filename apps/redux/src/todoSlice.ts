import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from './store';
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  owner: string;
}

interface TodoState {
  list: Todo[];
  nextId: number;
}

const initialState: TodoState = {
  list: [],
  nextId: 1,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ text: string; owner: string }>) => {
      const { text, owner } = action.payload;
      state.list.push({
        id: state.nextId,
        text,
        completed: false,
        owner,
      });
      state.nextId += 1;
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.list.find((item) => item.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;

export const selectTodoList = (state: RootState) => state.todo.list;
export const selectCurrentUser = (state: RootState) => state.user;
export const selectCurrentUserTodos = (state: RootState) => {
  const todos = selectTodoList(state);
  const user = selectCurrentUser(state);

  return todos.filter((todo) => todo.owner === user.name);
};