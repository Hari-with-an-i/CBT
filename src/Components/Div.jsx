import React, { useState } from 'react';
import '../index.css';

export default function ToDo() {
  const [todos, setTodos] = useState([
    {
      id: Date.now(),
      text: 'Explore the captivating beauty of Antelope Canyon...',
      editing: false,
    }
  ]);

  // Switch a todo into editing mode when its text is clicked
  const handleEdit = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, editing: true } : todo
    ));
  };

  // Update the todo text as the user types
  const handleTextChange = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  // Exit edit mode (e.g., on blur)
  const handleSave = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, editing: false } : todo
    ));
  };

  // Append a new todo at the end of the list
  const addNewTodo = () => {
    const newTodo = { id: Date.now(), text: '', editing: false };
    setTodos([...todos, newTodo]);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="pt-16 max-w-lg mx-auto">
        {todos.map((todo, index) => (
          <div
            key={todo.id}
            className="flex items-center gap-6 rounded-lg bg-white shadow-lg dark:bg-neutral-700 text-left mt-6 p-6"
            onClick={() => !todo.editing && handleEdit(todo.id)}
          >
            {todo.editing ? (
              <input
                type="text"
                value={todo.text}
                onChange={(e) => handleTextChange(todo.id, e.target.value)}
                onBlur={() => handleSave(todo.id)}
                autoFocus
                placeholder="Click to edit"
                className="mb-0 text-base text-neutral-500 dark:text-neutral-300 bg-transparent border-none outline-none w-full"
              />
            ) : (
              <p
                className="mb-0 text-base text-neutral-500 dark:text-neutral-300 cursor-text w-full"
                style={{ minHeight: '1.5em' }}
              >
                {todo.text || "Click to edit"}
              </p>
            )}
            {/* Render the plus button only on the last block */}
            {index === todos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering edit mode
                  addNewTodo();
                }}
                type="button"
                className="inline-block rounded bg-blue-800 px-1 py-1 text-lg text-white"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
