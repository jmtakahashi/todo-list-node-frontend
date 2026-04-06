import { useNavigate } from 'react-router';
import List from './List';
import ListComposer from './ListComposer';
import { useSelector } from 'react-redux';
import { selectUserId } from '../auth/authSlice';
import { useFetchListsQuery } from './listApiSlice';
import { selectGlobalError } from '../globalError/globalErrorSlice';

const AddEditLists = () => {
  const navigate = useNavigate();

  const globalError = useSelector(selectGlobalError);

  const userId = useSelector(selectUserId);

  const { data, isLoading, isSuccess, isError, error } = useFetchListsQuery({
    userId,
  });

  return (
    <div className='todo-list__container'>
      <div className='todo-list__lists-header'>
        <h2>Add/Edit Lists</h2>
        <button
          className='todo-list__button--link'
          onClick={() => navigate(-1)}
        >
          Back to Todo Lists
        </button>
      </div>

      <ListComposer userId={userId} />

      {isLoading && <p>Loading...</p>}

      {isError && (
        <p className='error' data-error='error'>
          {error.data?.message || 'An error occurred.'}
          {JSON.stringify(error) || 'An error occurred.'}
        </p>
      )}

      {globalError && (
        <p className='error' data-error='global-error'>
          {globalError}
        </p>
      )}

      {isSuccess ? (
        data.lists?.length === 0 || data.ids?.length === 0 ? (
          <p>You have no lists yet. Add one above.</p>
        ) : (
          <ul className='todo-list__lists'>
            {/* this map callback function is specific to RTK query w/ createEntityAdapter, data contains ids and entities */}
            {data.ids.map((id) => {
              const list = data.entities[id];
              return (
                <li className='todo-list__list' key={list._id ?? list.id}>
                  <List list={list} userId={userId} />
                </li>
              );
            })}
          </ul>
        )
      ) : null}
    </div>
  );
}

export default AddEditLists