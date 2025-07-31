# TODOList Store不同方案对比

项目计划
1. 使用todolist store, users store两个完成todolist，需要包含todolist的增删查改
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




## Zustand


## Jotai

## Valtio