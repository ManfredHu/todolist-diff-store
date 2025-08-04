import { create } from "zustand";
import { useUserStore } from "./userStore";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  owner: string;
}

interface TodoState {
  list: Todo[];
  nextId: number;
  addTodo: (text: string, owner: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  selectCurrentUserTodos: () => Todo[];
  addTodoWithUser: (text: string) => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  list: [],
  nextId: 1,

  addTodo: (text, owner) => {
    const { list, nextId } = get();
    const newTodo: Todo = {
      id: nextId,
      text,
      completed: false,
      owner,
    };
    set({
      list: [...list, newTodo],
      nextId: nextId + 1,
    });
  },

  toggleTodo: (id) => {
    set((state) => ({
      list: state.list.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  },

  deleteTodo: (id) => {
    set((state) => ({
      list: state.list.filter((todo) => todo.id !== id),
    }));
  },

  selectCurrentUserTodos: () => {
    const { list } = get();
    const { name } = useUserStore.getState(); // 获取当前登录用户名
    return list.filter((todo) => todo.owner === name);
  },

  addTodoWithUser: (text) => {
    const { name } = useUserStore.getState();
    if (!name) return;
    get().addTodo(text, name);
  },
}));
