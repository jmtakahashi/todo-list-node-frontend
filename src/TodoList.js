import React from 'react'
import { Link } from 'react-router';
import useTodo from './hooks/useTodo';
import TodoComposer from './TodoComposer';
import Todo from './Todo';

export default function TodoList({ isLoggedIn }) {
  const { todos, loading, error, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodo();

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchTodos()
    }
  }, [fetchTodos, isLoggedIn]);

  const handleAddTodo = (newTodo) => addTodo(newTodo);
  
  const handleUpdateTodo = (updatedTodo) => updateTodo(updatedTodo);

  const handleDeleteTodo = (id) => deleteTodo(id);
  
  return (
    <>
      {isLoggedIn ? (
        <ul className='todo-list__todos'>
          <TodoComposer handleAddTodo={handleAddTodo} />
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}

          {!loading &&
            !error &&
            todos.map((todo) => (
              <Todo
                key={todo._id ?? todo.id}
                todo={todo}
                handleUpdateTodo={handleUpdateTodo}
                handleDeleteTodo={handleDeleteTodo}
                loading={todo.loading}
                editLoading={todo.editLoading}
              />
            ))}
        </ul>
      ) : (
        <p className='todo-list__logged-out-message'>
          Please <Link to="/signin">sign in</Link> to view your todo list.
        </p>
      )}
    </>
  );
}
