import { useParams } from 'react-router';
import TodoComposer from './TodoComposer';
import Todo from './Todo';
import { useFetchTodosQuery } from './todoApiSlice';
import { useSelector } from 'react-redux';
import { selectUserId } from '../auth/authSlice';
import { selectGlobalError } from '../globalError/globalErrorSlice'
import { useFetchListsQuery } from '../lists/listApiSlice';

export default function Todos() {
  const globalError = useSelector(selectGlobalError)
  
  const userId = useSelector(selectUserId);

  const { listId } = useParams();

  const { list } = useFetchListsQuery({ userId }, {
    selectFromResult: ({ data }) => ({
      list: data?.entities[listId]
    })
  });

  // the options we can pass to useFetchTodosQuery are made possible by adding
  // the setupListeners(store.dispatch); line in /app/store.js
  const { data, isLoading, isSuccess, isError, error } = useFetchTodosQuery(
    { label: 'todosList', userId, listId } /* {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  } */,
  );

  const usingCreateEntityAdapter = true; // Set to true if using createEntityAdapter in todoApiSlice

  return (
    <>
      <div className='todo-list__todos-header'>
        <h2>Todos for {list?.title}</h2>
      </div>

      <TodoComposer listId={listId} userId={userId} />

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
        data.todos?.length === 0 || data.ids?.length === 0 ? (
          <p>You have no todos for this list yet. Add one above.</p>
        ) : usingCreateEntityAdapter ? (
          <ul className='todo-list__todos'>
            {/* this map callback function is specific to RTK query w/ createEntityAdapter, data contains ids and entities */}
            {data.ids.map((id) => {
              const todo = data.entities[id];
              return (
                <li className='todo-list__todo' key={todo._id ?? todo.id}>
                  <Todo todo={todo} listId={listId} userId={userId} />
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className='todo-list__todos'>
            {/* this map callback function is the standard way */}
            {data.todos.map((todo) => (
              <Todo
                key={todo._id}
                todo={todo}
                listId={listId}
                userId={userId}
              />
            ))}
          </ul>
        )
      ) : null}
    </>
  );
}
