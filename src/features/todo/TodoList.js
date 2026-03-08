import TodoComposer from './TodoComposer';
import Todo from './Todo';
import { useFetchTodosQuery } from './todoApiSlice';

export default function TodoList() {
  // the options we can pass to useFetchTodosQuery are made possible by adding
  // setupListeners(store.dispatch); in store.js
  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useFetchTodosQuery('todosList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <ul className='todo-list__todos'>
      <TodoComposer />
      {isLoading && <p>Loading...</p>}

      {isError && <p>{error?.data?.message || 'An error occurred.'}</p>}

      {/* this map callback function is specific to RTK query results */}
      {isSuccess &&
        todos.ids.map((id) => {
          const todo = todos.entities[id];
          return <Todo key={todo._id ?? todo.id} todo={todo} />;
        })
      }
    </ul>
  );
}
