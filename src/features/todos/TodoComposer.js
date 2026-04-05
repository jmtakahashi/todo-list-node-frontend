import React from 'react'
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAddTodoMutation } from './todoApiSlice';

import { setGlobalError } from '../globalError/globalErrorSlice';

export default function TodoComposer({ listId, userId }) {
  const inputRef = React.useRef(null);

  const [addTodo, { isLoading }] = useAddTodoMutation();

  const dispatch = useDispatch();

  // local state for new todo
  const [task, setTask] = React.useState('');

  // focus the input field when the component mounts
  React.useEffect(() => {
    inputRef.current.focus();
  }, []);

  const canSubmit = Boolean(task) && !isLoading;

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (canSubmit) {
      try {
        dispatch(setGlobalError(null)); // Clear any existing global error before attempting to add a new todo
        // using the mutations returned from our slice, we don't need to manually set state or dispatch actions, 
        // RTK Query will handle that for us and give us the result of the mutation (or any error) in the returned object
        await addTodo({ newTodo: { task: task }, userId, listId }).unwrap();
        setTask(''); // clear the input field after successful submission
      } catch (error) {
        dispatch(setGlobalError(error.data?.message || 'Failed to add todo. Please try again.'));
      }
    }
    inputRef.current.focus();
  }

  // TESTING: checking error and isError states from the mutation hook
  /*
  React.useEffect(() => {
    if (isError) {
      console.error('in TodoComposer. isError is true. error: ', error);
    }
  }, [isError, error]);
  */

  return (
    <form
      id='todoComposer'
      onSubmit={handleAddTodo}
      className='todo-list__composer'
    >
      <input
        ref={inputRef}
        id='newTodo'
        name='newTodo'
        type='text'
        placeholder='New todo task'
        onChange={(e) => setTask(e.target.value)}
        value={task}
        autoComplete='off'
        required
      />
      <button type='submit' disabled={!canSubmit}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </form>
  );
}
