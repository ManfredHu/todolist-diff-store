import { model } from '@modern-js/runtime/model';

export const todoModel = model('todo').define({
  state: {
    todos: [] as { id: number; text: string; completed: boolean }[],
  },
  actions: {
    addTodo(state, text: string) {
      state.todos.push({
        id: Date.now(),
        text,
        completed: false,
      });
    },
    toggleTodo(state, id: number) {
      const todo = state.todos.find((t) => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
});
