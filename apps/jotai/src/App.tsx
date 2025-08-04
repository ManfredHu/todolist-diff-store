import { useState } from 'react'
import './App.css'
import {
  currentUserTodosAtom,
  addTodoAtom,
  deleteTodoAtom,
  addTodoWithUserAtom,
  toggleTodoAtom,
} from './stores/todos';
import {
  logoutAtom,
  loggedInAtom,
  userNameAtom,
  loginAtom,
} from './stores/users'
import { useAtom } from 'jotai';

function App() {
  const [input, setInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const [todos] = useAtom(currentUserTodosAtom);
  const [, deleteTodo] = useAtom(deleteTodoAtom);
  const [, logout] = useAtom(logoutAtom);
  const [loggedIn] = useAtom(loggedInAtom);
  const [name] = useAtom(userNameAtom);
  const [, login] = useAtom(loginAtom);
  const [, addTodoWithUser] = useAtom(addTodoWithUserAtom);
  const [, toggleTodo] = useAtom(toggleTodoAtom);

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
  )
}

export default App
