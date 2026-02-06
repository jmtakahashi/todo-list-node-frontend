import React from 'react'

export default function Todo({ todo, handleUpdateTodo, handleDeleteTodo }) {
  // local state to manage the task text while editing
  const [task, setTask] = React.useState(todo.task);
  const [editing, setEditing] = React.useState(false);

  const handleEditTodoClick = () => {
    setEditing(!editing);
  };

  const handleEditTodo = (e) => {
    setTask(e.target.value);
  };

  const handleCheckboxClick = () => {
    handleUpdateTodo({ ...todo, completed: !todo.completed });
  };

  const handleSaveEditedTodoClick = () => {
    handleUpdateTodo({ ...todo, task });
    setEditing(false);
  };

  const handleDeleteTodoClick = () => {
    handleDeleteTodo(todo._id);
  };

  return (
    <li className='todo-list__todo'>
      <label htmlFor={todo._id}>
        <input
          type='checkbox'
          id={todo._id}
          className='todo-list__todo-checkbox'
          checked={todo.completed}
          readOnly
          onChange={handleCheckboxClick}
        />
        {editing === true ? (
          <input
            type='text'
            className='todo-list__todo-edit-input'
            value={task}
            onChange={handleEditTodo}
          />
        ) : (
          <span>{todo.task}</span>
        )}
      </label>
      <div>
        {editing === true ? (
          <button onClick={handleSaveEditedTodoClick}>Save</button>
        ) : (
          <>
            <button onClick={handleEditTodoClick}>Edit</button>
            <button onClick={handleDeleteTodoClick}>Delete</button>
          </>
        )}
      </div>
    </li>
  );
}
