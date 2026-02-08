import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';

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
      <form
        id='todoListComposer'
        onSubmit={handleSubmit}
        className='todo-list__composer'
      >
        <input
          ref={inputRef}
          name='new-todo'
          type='text'
          placeholder='New todo task'
          onChange={handleUpdateLabel}
          value={label}
          required
        />
        <button type='submit' disabled={label.length === 0}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>
    </li>
  );
}
