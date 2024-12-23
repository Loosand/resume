"use client"

import { useState } from "react"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function DebugClientComponent() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState("")

  const addTodo = () => {
    if (input.trim() === "") return

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    }

    setTodos([...todos, newTodo])
    setInput("")
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">待办事项清单</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          className="flex-1 rounded border px-3 py-2"
          placeholder="添加新的待办事项..."
        />
        <button
          onClick={addTodo}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          添加
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 rounded border p-2"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="h-5 w-5"
            />
            <span
              className={`flex-1 ${todo.completed ? "text-gray-500 line-through" : ""}`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-2 py-1 text-red-500 hover:text-red-700"
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
