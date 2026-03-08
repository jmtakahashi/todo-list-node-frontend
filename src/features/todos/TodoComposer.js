import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAddTodoMutation } from './todosSlice';
import { useDispatch } from 'react-redux';
import { setError } from '../errors/errorSlice';

export default function TodoComposer() {
  const inputRef = React.useRef(null);

  const [addTodo, { isLoading }] = useAddTodoMutation();

  const dispatch = useDispatch();

  // local state for new todo label
  const [task, setTask] = React.useState('');

  React.useEffect(() => {
    inputRef.current.focus();
  }, []);

  const canSubmit = Boolean(task) && !isLoading;

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (canSubmit) {
      try {
        // using the mutations returned from our slice, we don't need to manually set state or dispatch actions, 
        // RTK Query will handle that for us and give us the result of the mutation (or any error) in the returned object
        const response = await addTodo({ task: task }).unwrap();
        console.log('in TodoComposer. response: ', response);
        setTask('');
      } catch (error) {
        console.error('in TodoComposer. Error adding todo: ', error);
        dispatch(setError({ error: error.data?.message }))
      } finally {
     }
    }
    inputRef.current.focus();
  }

  return (
    <li>
      <form
        id='todoListComposer'
        onSubmit={handleAddTodo}
        className='todo-list__composer'
      >
        <input
          ref={inputRef}
          name='new-todo'
          type='text'
          placeholder='New todo task'
          onChange={(e) => setTask(e.target.value)}
          value={task}
          autoComplete='off'
          required
        />
        <button type='submit' disabled={task.length === 0}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>
    </li>
  );
}
