import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAddListMutation } from './listApiSlice';
import { setGlobalError } from '../globalError/globalErrorSlice';

const ListComposer = ({ userId }) => {
  const inputRef = React.useRef(null);

  const [addList, { isLoading }] = useAddListMutation();

  const dispatch = useDispatch();

  // local state for new list
  const [list, setList] = React.useState('');

  // focus the input field when the component mounts
  React.useEffect(() => {
    inputRef.current.focus();
  }, []);

  const canSubmit = Boolean(list) && !isLoading;

  const handleAddList = async (e) => {
    e.preventDefault();
    if (canSubmit) {
      try {
        dispatch(setGlobalError(null)); // clear any existing global errors before attempting to add a list
        // using the mutations returned from our slice, we don't need to manually set state or dispatch actions, 
        // RTK Query will handle that for us and give us the result of the mutation (or any error) in the returned object
        await addList({ newList: { title: list }, userId }).unwrap();
        setList(''); // clear the input field after successful submission
      } catch (error) {
        dispatch(setGlobalError(error.data?.message || 'Failed to add list. Please try again.'));
      }
    }
    inputRef.current.focus();
  }

  return (
    <form
      id='listComposer'
      onSubmit={handleAddList}
      className='todo-list__composer'
    >
      <input
        ref={inputRef}
        id='newList'
        name='newList'
        type='text'
        placeholder='New list'
        onChange={(e) => setList(e.target.value)}
        value={list}
        autoComplete='off'
        required
      />
      <button type='submit' disabled={!canSubmit}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </form>
  );
};

export default ListComposer;
