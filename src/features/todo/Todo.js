import React from 'react'
import { useUpdateTodoMutation, useDeleteTodoMutation } from './todoApiSlice';
import { useDispatch } from 'react-redux';
import { setGlobalError } from '../globalError/globalErrorSlice';

export default function Todo({ todo }) {
  const [updateTodo, { isLoading: editLoading }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: deleteLoading }] = useDeleteTodoMutation();
  const dispatch = useDispatch();

  // local state to manage the task text while editing
  const [task, setTask] = React.useState(todo.task);
  const [editing, setEditing] = React.useState(false);

  const handleCheckboxClick = async () => {
    try {
      const response = await updateTodo({ id: todo._id, updatedFields: { completed: !todo.completed, task: todo.task } }).unwrap();
      console.log('in Todo. updateTodo checkbox response: ', response);
    } catch (error) {
      console.error('in Todo. Error updating done state for todo: ', error);
      dispatch(setGlobalError(error.data?.message || 'Error updating todo'))
    }
  };

  const handleEditTodoClick = (e) => {
    setEditing(!editing);
    // focus the input field when entering edit mode
  };

  const handleEditTodo = (e) => {
    setTask(e.target.value);
  };

  const handleSaveEditedTodoClick = async () => {
    setEditing(false);
    try {
      const response = await updateTodo({ id: todo._id, updatedFields: { task: task, completed: todo.completed } }).unwrap();
      console.log('in Todo. updateTodo body response: ', response);
    } catch (error) {
      console.error('in Todo. Error saving edited todo: ', error);
      dispatch(setGlobalError(error.data?.message || 'Error updating todo'))
    }
  };

  const handleCancelEditedTodoClick = () => {
    // reset the task text to the original value (derived from props) when canceling edit
    setTask(todo.task);
    setEditing(false);
  }

  const handleDeleteTodoClick = async () => {
    try {
      const response = await deleteTodo(todo._id).unwrap();
      console.log('in Todo. deleteTodo response: ', response);
    } catch (error) {
      console.error('in Todo. Error deleting todo: ', error);
      dispatch(setGlobalError(error.data?.message || 'Error deleting todo'))
    }
  };

  return (
    <li className='todo-list__todo'>
      {deleteLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <label htmlFor={todo._id}>
            <div className='todo-list__todo-checkbox-container'>
              <input
                type='checkbox'
                id={todo._id}
                checked={todo.completed}
                readOnly
                onChange={handleCheckboxClick}
              />
              <span className='todo-list__todo-checkbox'></span>
            </div>

            {editLoading ? (
              <span className='todo-list__todo-task todo-list__todo-task--editLoading'>Loading...</span>
            ) : (
              <>
                {editing === true ? (
                  <input
                    type='text'
                    name='task'
                    className='todo-list__todo-edit-task-input'
                    value={task}
                    onChange={handleEditTodo}
                  />
                ) : (
                  <span className='todo-list__todo-task'>{todo.task}</span>
                )}
              </>
            )}
          </label>

          <div className='todo-list__todo-buttons-container'>
            {editing === true ? (
              <React.Fragment>
                <button onClick={handleSaveEditedTodoClick}>Save</button>
                <button onClick={handleCancelEditedTodoClick}>Cancel</button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button onClick={handleEditTodoClick}>Edit</button>
                <button onClick={handleDeleteTodoClick}>Delete</button>
              </React.Fragment>
            )}
          </div>
        </>
      )}
    </li>
  );
}
