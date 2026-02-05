import React from 'react'
import TodoComposer from './TodoComposer';
import Todo from './Todo';

export default function TodoList() {
  const [todos, setTodos] = React.useState([])

  const handleAddTodo = (newTodo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }
  
  const handleUpdateTodo = (updatedTodo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
    );
  }

  const handleDeleteTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.filter(todo => todo.id !== id)
    );
  }

  return (
    <div className='todo-list__container'>
      <h1>Todo List</h1>
      <ul className='todo-list__todos'>
        <TodoComposer handleAddTodo={handleAddTodo} />
        {todos &&
          todos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              handleUpdateTodo={handleUpdateTodo}
              handleDeleteTodo={handleDeleteTodo}
            />
          ))}
      </ul>
    </div>
  );
}
