import React from 'react'

export default function Todo({ todo, handleUpdateTodo, handleDeleteTodo }) {
  const [editing, setEditing] = React.useState(false);

  const handleCheckboxClick = () => {
    handleUpdateTodo({ ...todo, completed: !todo.completed });
  }

  const handleEditTodoClick = () => {
    setEditing(!editing);
  };

  const handleEditTodo = (e) => {
    handleUpdateTodo({ ...todo, task: e.target.value });
  }
  
  const handleDeleteTodoClick = () => {
    handleDeleteTodo(todo.id);
  };
  
  return (
    <li className='todo-list__todo'>
      <label htmlFor={todo.id}>
        <input
          type='checkbox'
          id={todo.id}
          className='todo-list__todo-checkbox'
          checked={todo.completed}
          readOnly
          onChange={handleCheckboxClick}
        />
        {editing === true ? (
          <input
            type='text'
            className='todo-list__todo-edit-input'
            value={todo.task}
            onChange={handleEditTodo}
          />
        ) : (
          <span>{todo.task}</span>
        )}
      </label>
      <div>
        <button onClick={handleEditTodoClick}>
          {editing === true ? 'Save' : 'Edit'}
        </button>
        {!editing && <button onClick={handleDeleteTodoClick}>Delete</button>}
      </div>
    </li>
  );
}
