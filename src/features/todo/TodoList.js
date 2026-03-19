import TodoComposer from './TodoComposer';
import Todo from './Todo';
import { useFetchTodosQuery } from './todoApiSlice';
import { useSelector } from 'react-redux';
import { selectGlobalError } from '../globalError/globalErrorSlice'

export default function TodoList() {
  const globalError = useSelector(selectGlobalError)

  // the options we can pass to useFetchTodosQuery are made possible by adding
  // the setupListeners(store.dispatch); line in /app/store.js
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useFetchTodosQuery('todosList', /* {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  } */);

  const usingCreateEntityAdapter = true; // Set to true if using createEntityAdapter in todoApiSlice

  return (
    <ul className='todo-list__todos'>
      <TodoComposer />
      {isLoading && <p>Loading...</p>}

      {isError && <p className='error'>{error.data?.message || 'An error occurred.'}</p>}
      
      {globalError && <p className='error'>{ globalError }</p>}

      {isSuccess ? (

        data.todos?.length === 0 || data.ids?.length === 0 ? (
          <p>You have no todos yet. Add one above!</p>
        ) : (
          usingCreateEntityAdapter ? (
            <>
              {/* this map callback function is specific to RTK query w/ createEntityAdapter, data contains ids and entities */}
              {  data.ids.map((id) => {
                  const todo = data.entities[id];
                  return <Todo key={todo._id ?? todo.id} todo={todo} />;
                })}
            </>
          ) : (
            <>
              {/* this map callback function is the standard way */}
              {data.todos.map((todo) => <Todo key={todo._id} todo={todo} />)}
            </>
          )
        )
        
      ) : null }
    </ul>
  );
}
