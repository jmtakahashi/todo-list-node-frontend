import React from 'react'

export default function TodoComposer({ handleAddTodo }) {
  const [label, setLabel] = React.useState('');
  const inputRef = React.useRef(null);

  const handleUpdateLabel = (e) => {
    setLabel(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddTodo(
      {
        id: Math.floor(Math.random() * 1000000),
        task: label,
        completed: false,
        dateAdded: new Date().toISOString(),
      }
    );
    setLabel('');
    inputRef.current.focus();
  }

  return (
    <li>
      <form id="todoListComposer" onSubmit={handleSubmit} className='todo-list__composer'>
        <input
          ref={inputRef}
          name='new-todo'
          type='text'
          placeholder='New todo task'
          onChange={handleUpdateLabel}
          value={label}
        />
        <button type="submit" disabled={label.length === 0}>
          Add Todo
          </button>
      </form>
    </li>
  );
}
