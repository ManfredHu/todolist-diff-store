# TODOList Store不同方案对比

项目计划
pnpm create vite zustand-todo --template react-ts1. 使用todolist store, users store两个完成todolist，需要包含todolist的增删查改
2. 需要可以对todolist store进行修改，比如读取users store进行数据过滤后输出
3. 需要考虑todolist store 和 users store的异步接口获取，通过异步接口调用获取对应数据


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

## Valtio