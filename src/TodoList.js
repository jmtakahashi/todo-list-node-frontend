import React from 'react'
import TodoComposer from './TodoComposer';
import Todo from './Todo';

export default function TodoList() {
  const [todos, setTodos] = React.useState([])

  React.useEffect(() => {
    localStorage.getItem('todos') && setTodos(JSON.parse(localStorage.getItem('todos')));
  }, [])

  const handleAddTodo = (newTodo) => {
    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  }
  
  const handleUpdateTodo = (updatedTodo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo,
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  }

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
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
