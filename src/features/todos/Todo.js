import React from 'react'
import { useUpdateTodoMutation, useDeleteTodoMutation } from './todoApiSlice';
import { useDispatch } from 'react-redux';
import { setGlobalError } from '../globalError/globalErrorSlice';

export default function Todo({ todo, listId, userId }) {
  const [updateTodo, { isLoading: editLoading }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: deleteLoading }] = useDeleteTodoMutation();
  const dispatch = useDispatch();

  // local state to manage the task text while editing
  const [task, setTask] = React.useState(todo.task);
  const [editing, setEditing] = React.useState(false);

  const handleCheckboxClick = async () => {
    try {
      await updateTodo({ todoId: todo._id, updatedFields: { completed: !todo.completed, task: todo.task }, userId, listId }).unwrap();
    } catch (error) {
      dispatch(setGlobalError(error.data?.message || 'Error updating todo'))
    }
  };

  const handleEditTodoClick = () => {
    setEditing(!editing);
    // focus the input field when entering edit mode
  };

  const handleEditTodo = (e) => {
    setTask(e.target.value);
  };

  const handleSaveEditedTodoClick = async () => {
    setEditing(false);
    try {
      await updateTodo({ todoId: todo._id, updatedFields: { task: task, completed: todo.completed }, userId, listId }).unwrap();
    } catch (error) {
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
      await deleteTodo({ todoId: todo._id, userId, listId }).unwrap();
    } catch (error) {
      dispatch(setGlobalError(error.data?.message || 'Error deleting todo'))
    }
  };

  return (
    <>
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
                <button className='todo-list__button--link' onClick={handleSaveEditedTodoClick}>Save</button>
                <button className='todo-list__button--link' onClick={handleCancelEditedTodoClick}>Cancel</button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button className='todo-list__button--link' onClick={handleEditTodoClick}>Edit</button>
                <button className='todo-list__button--link' onClick={handleDeleteTodoClick}>Delete</button>
              </React.Fragment>
            )}
          </div>
        </>
      )}
    </>
  );
}
