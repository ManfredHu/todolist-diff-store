import { atom } from 'jotai'
import { userNameAtom } from './users';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  owner: string;
}

const todoListAtom = atom<Todo[]>([])
const nextIdAtom = atom(1)

// 增删改方法
export const addTodoAtom = atom(null, (get, set, { text, owner }: { text: string; owner: string }) => {
  const id = get(nextIdAtom)
  const newTodo: Todo = { id, text, completed: false, owner }
  set(todoListAtom, [...get(todoListAtom), newTodo])
  set(nextIdAtom, id + 1)
})

export const toggleTodoAtom = atom(null, (get, set, id: number) => {
  const list = get(todoListAtom)
  set(
    todoListAtom,
    list.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  )
})

export const deleteTodoAtom = atom(null, (get, set, id: number) => {
  const list = get(todoListAtom)
  set(todoListAtom, list.filter((todo) => todo.id !== id))
})

export const currentUserTodosAtom = atom((get) => {
  const todos = get(todoListAtom);
  const currentUser = get(userNameAtom);
  return todos.filter((todo) => todo.owner === currentUser);
});

// 用当前用户添加 todo
export const addTodoWithUserAtom = atom(null, (get, set, text: string) => {
  const user = get(userNameAtom)
  set(addTodoAtom, { text, owner: user })
})

// 导出基础状态和方法
export {
  todoListAtom,
  nextIdAtom
}
