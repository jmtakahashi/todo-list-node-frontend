import TodoComposer from './TodoComposer';
import Todo from './Todo';
import { useFetchTodosQuery, selectAllTodos } from './todosSlice';
import { useSelector } from 'react-redux';

export default function TodoList() {
  console.log('rendering TodoList.js...');
  // the options we can pass to useFetchTodosQuery are made possible by adding
  // setupListeners(store.dispatch); in store.js
  const {
    isLoading,
    isSuccess,
    isError,
    error,
  } = useFetchTodosQuery(undefined, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const todos = useSelector(selectAllTodos);

  return (
    <ul className='todo-list__todos'>
      <TodoComposer />
      {isLoading && <p>Loading...</p>}

      {isError && <p>{JSON.stringify(error.data?.message)}</p>}

      {isSuccess &&
        todos.map((todo) => <Todo key={todo._id ?? todo.id} todo={todo} />)}
    </ul>
  );
}
