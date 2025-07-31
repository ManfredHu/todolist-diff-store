import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import type { AppDispatch } from "./store";
import { deleteTodo, selectCurrentUser, selectCurrentUserTodos, toggleTodo } from "./todoSlice";
import { addTodoWithUser } from "./todoThunks";
import { fetchUser, login, logout } from "./userSlice";

function App() {
  const [input, setInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const dispatch: AppDispatch = useDispatch();
  const todos = useSelector(selectCurrentUserTodos);
  const user = useSelector(selectCurrentUser)
  const handleAdd = () => {
    if (input.trim()) {
      dispatch(addTodoWithUser(input.trim()));
      setInput("");
    }
  };

  const handleLogin = () => {
    if (usernameInput.trim()) {
      dispatch(login(usernameInput.trim()));
    }
  };

  useEffect(() => {
    dispatch(fetchUser()); // 自动异步设置 user.name 和 loggedIn
  }, []);
  
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
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
      <p>User: {user.loggedIn ? user.name : "Not logged in"}</p>

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
              onClick={() => dispatch(toggleTodo(todo.id))}
            >
              {todo.text}
            </span>
            <button
              onClick={() => dispatch(deleteTodo(todo.id))}
              style={{ marginLeft: 10 }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
