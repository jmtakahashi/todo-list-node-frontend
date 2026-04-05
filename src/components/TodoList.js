import { Outlet } from 'react-router'
import Lists from '../features/lists/Lists'

const TodoList = () => {
  return (
    <div className='todo-list__container'>
      <Lists />
      <Outlet />
    </div>
  );
}

export default TodoList