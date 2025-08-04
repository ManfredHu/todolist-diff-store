[English Version](./README.md)

# TODOList Store不同方案对比

项目计划
1. 使用todolist store, users store两个完成todolist，需要包含todolist的增删查改
1. 需要可以对todolist store进行修改，比如读取users store进行数据过滤后输出
2. 需要考虑todolist store 和 users store的异步接口获取，通过异步接口调用获取对应数据


| 对比维度       | [Redux](https://github.com/reduxjs/redux)                                   | [Reduck](https://github.com/web-infra-dev/reduck)                                        | [Zustand](https://github.com/pmndrs/zustand)                                    | [Jotai](https://github.com/pmndrs/)                                     |
| -------------- | ------------------------------------- | --------------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| 学习认知成本   | 高 — 需理解 actions, reducers, middleware，概念较多 | 中 — 简化了 Redux 概念，支持跨 store 引入，略有自定义API | 低 — 只需理解 store 和函数式写法，无额外复杂概念 | 中 — Atom 概念需理解，区分读写，异步写法相对复杂  |
| 易用性         | 中 — 结构清晰，但写法繁琐                | 中 — API 简单，跨 store方便，但项目不活跃          | 高 — 轻量简单，函数式，无模板代码             | 高 — 原子化状态管理，细粒度灵活，但写法稍复杂      |
| 当前Star数     | ⭐ 61.3k+ (2025)                       | ⭐ 81 (项目不活跃)                            | ⭐ 53.9k+                                   | ⭐ 20.3k+                                   |
| 生态稳定性     | 高 — 业界标准，广泛采用，社区活跃         | 低 — 维护停滞，使用场景有限                      | 中 — 生态快速增长，广泛小项目采用               | 中 — 新兴生态，原子状态管理思想兴起     |
| 扩展性         | 高 — 可结合中间件、redux-saga、redux-thunk等 | 中 — 支持effects，但生态有限                      | 高 — 支持中间件和中间层，灵活且无侵入             | 高 — 可组合 atom，支持异步和复杂状态衍生           |
| 性能           | 中 — 基于 Redux，批量更新及优化需手动     | 中 — 基于 Redux 思想，性能类似                    | 高 — 轻量，局部更新，极简且性能优秀                | 高 — 原子化读写，最小更新范围，性能表现优秀          |


---

## Redux
传统的开源方案，跟着React一期发展很多年了

![](./excalidraw/redux.png)

- store1
  - state
  - actions
  - reducer
- store2
  - 如何获取其他store的数据: 引入 RootState -> store1 -> get store1 State -> 获取对应属性
  - 如何改变其他sotre的数据: 引入 root dispatch/store1 action -> trigger store1 reducer change state

Redux的缺点
1. 每个数据得先考虑是同步还是异步，例如组件状态是本地数据，接口获取的是异步数据得用action
2. 如何获取其他store的数据，需要从树的概念出发一步步引入
3. 每个应用都是一颗大树，如何做通用化？通过根store将每个store引入

## Reduck
字节web-infra的方案: [https://github.com/web-infra-dev/reduck](https://github.com/web-infra-dev/reduck)，看样子是不再维护了。😑

写法很简单，可以看到可以跨store引入其他store数据. `use(usersModel)`

```TS
export const todosModel = model<TodoState>("todos").define(
  (_context, { use }) => {
    return {
      state: initialState,
      actions: {
        addTodo: (state, { text, owner }: { text: string; owner: string }) => {
          // ……
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
```

使用也非常简单，使用useModel引入后即可解析state和action/effects使用
```TS
const [
    { selectCurrentUserTodos: todos },
    { addTodoWithUser, toggleTodo, deleteTodo },
  ] = useModel(todosModel);
```

## Zustand
挺好用的库，核心就store概念，没其他乱七八糟的。函数式写法也非常棒，对比reduck不需要区分属性和方法，对比redux不需要引入reducer，actions等概念

```TS
import { create } from "zustand";
import { useUserStore } from "./userStore";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  owner: string;
}

interface TodoStore {
  list: Todo[];
  nextId: number;
  addTodo: (text: string, owner: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  selectCurrentUserTodos: () => Todo[];
  addTodoWithUser: (text: string) => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
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

  toggleTodo: (id) => set((state) => ({
    list: state.list.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  })),

  deleteTodo: (id) => set((state) => ({
    list: state.list.filter((todo) => todo.id !== id),
  })),

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
```

1. 通过 `create<T>` 声明整个store的类型
2. state和actions混合不用区分，如果属性非常简单也可以一行代码搞定。甚至使用各种中间件简化get/set写法
3. 通过 `set, get`可以获取到本身store的设置/获取方法，也可以引用其他store类似 `const { name } = useUserStore.getState();` 拿到其他store的属性

## Jotai

```TS
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
```

主要看 `const currentUser = get(userNameAtom);` 获取外部store数据的写法，可以看到写法需要具体到原子属性的读写。

而 `App.tsx` 的使用表示其实理解负担还是挺重的，需要理解每个属性是读取还是写入

```TS
const [todos] = useAtom(currentUserTodosAtom);         // 派生 Atom，只读。返回当前用户的 todos
const [, deleteTodo] = useAtom(deleteTodoAtom);        // 写入-only Atom，提供删除 Todo 的函数
const [, logout] = useAtom(logoutAtom);                // 写入-only Atom，提供注销函数
const [loggedIn] = useAtom(loggedInAtom);              // 普通 Atom，登录状态
const [name] = useAtom(userNameAtom);                  // 普通 Atom，用户名
const [, login] = useAtom(loginAtom);                  // 写入-only Atom，执行登录操作
const [, addTodoWithUser] = useAtom(addTodoWithUserAtom); // 写入-only Atom，添加当前用户的 todo
const [, toggleTodo] = useAtom(toggleTodoAtom);        // 写入-only Atom，切换 todo 状态
```
