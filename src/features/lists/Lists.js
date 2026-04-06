import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { useFetchListsQuery } from './listApiSlice';
import { useSelector } from 'react-redux';
import { selectGlobalError } from '../globalError/globalErrorSlice';
import { selectUserId } from '../auth/authSlice';

const Lists = () => {
  const navigate = useNavigate();

  const globalError = useSelector(selectGlobalError);

  const userId = useSelector(selectUserId);

  const { data, isLoading, isSuccess, isError, error } = useFetchListsQuery({
    userId,
  });

  const handleSelectList = (list) => {
    navigate(`/todo-list/${list._id}`);
  };

  return (
    <>
      <div className='todo-list__lists-header'>
        <h2>Lists</h2>
        <Link to='/add-edit-lists'>
          Add/Edit Lists
        </Link>
      </div>

      {isLoading && <p>Loading...</p>}

      {isError && (
        <p className='error' data-error='error'>
          {error.data?.message || 'An error occurred.'}
        </p>
      )}

      {globalError && (
        <p className='error' data-error='global-error'>
          {globalError}
        </p>
      )}

      {isSuccess ? (
        data.lists?.length === 0 || data.ids?.length === 0 ? (
          <p>You have no lists yet. Add one above!</p>
        ) : (
          <select
            id='lists'
            name='lists'
            className='todo-list__lists-select'
            onChange={(e) => handleSelectList(data.entities[e.target.value])}
            defaultValue=''
          >
            <option value='' disabled>
              Select a list
            </option>
            {/* this map callback function is specific to RTK query w/ createEntityAdapter, data contains ids and entities */}
            {data.ids.map((id) => {
              const list = data.entities[id];
              return (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              );
            })}
          </select>
        )
      ) : null}
    </>
  );
};

export default Lists;
