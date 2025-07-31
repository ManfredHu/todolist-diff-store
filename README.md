# TODOList Example in many store solutions

project details
1. 使用todolist store, users store两个完成todolist，需要包含todolist的增删查改
2. 需要可以对todolist store进行修改，比如读取users store进行数据过滤后输出
3. 需要考虑todolist store 和 users store的异步接口获取，通过异步接口调用获取对应数据


## Redux
Traditional tree storage scheme, like below example. 

- store1
  - state
  - actions
  - reducer
- store2
  - get others store state: includes Root -> store1 -> getState
  - change othters store state: root dispatch/store1 reducer -> change state

Every time developer need to thinking
1. Whether the data is obtained synchronously or asynchronously
2. how to get others store state
3. Every application is a big tree with too many attributes to manage

![](./excalidraw/redux.png)

## Reduck
bytedance solutions from infra Team: [https://github.com/web-infra-dev/reduck](https://github.com/web-infra-dev/reduck)


## Zustand


## Jotai

## Valtio