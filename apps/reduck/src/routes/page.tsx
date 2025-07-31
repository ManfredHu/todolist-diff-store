import { useModel } from "@modern-js/runtime/model";
import { useState } from "react";
import { todosModel } from "../models/todo.model";
import { usersModel } from "../models/user.model";
import "./index.css";

const Index = () => {
  const [input, setInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [{ name, loggedIn }, { login, logout }] = useModel(usersModel);
  const [
    { selectCurrentUserTodos: todos },
    { addTodoWithUser, toggleTodo, deleteTodo },
  ] = useModel(todosModel);
  const handleAdd = () => {
    if (input.trim()) {
      addTodoWithUser(input.trim());
      setInput("");
    }
  };
  const handleLogin = () => {
    if (usernameInput.trim()) {
      login(usernameInput.trim());
    }
  };

  // useEffect(() => {
  // dispatch(fetchUser()); // 自动异步设置 user.name 和 loggedIn
  // }, []);
  console.log("loggedIn", loggedIn);
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Todo List</h1>
      <div style={{ marginBottom: 10 }}>
        <input
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Enter your name"
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => logout()}>Logout</button>
      </div>

      <p>User: {loggedIn ? name : "Not logged in"}</p>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ marginLeft: 10 }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
