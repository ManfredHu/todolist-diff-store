# TODOList Example in many store solutions

## Redux
Traditional tree storage scheme, like below example

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

## 