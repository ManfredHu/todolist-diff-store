import { model } from "@modern-js/plugin-state/runtime";
import { usersModel } from "./user.model";

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

export const todosModel = model<TodoState>("todos").define(
  (_context, { use }) => {
    return {
      state: initialState,
      actions: {
        addTodo: (state, { text, owner }: { text: string; owner: string }) => {
          state.list.push({
            id: state.nextId,
            text,
            completed: false,
            owner,
          });
          state.nextId += 1;
        },
        toggleTodo: (state, id: number) => {
          const todo = state.list.find((item) => item.id === id);
          if (todo) todo.completed = !todo.completed;
        },
        deleteTodo: (state, id: number) => {
          state.list = state.list.filter((item) => item.id !== id);
        },
      },
      computed: {
        selectCurrentUserTodos(state) {
          const [{ name }] = use(usersModel);
          return state.list.filter((todo) => todo.owner === name);
        },
      },
      effects: {
        addTodoWithUser(text: string) {
          const [{ loggedIn, name }] = use(usersModel);
          const [{}, { addTodo }] = use(todosModel);
          if (loggedIn) {
            addTodo({ text, owner: name });
          }
        },
      },
    };
  }
);
