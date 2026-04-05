import React from 'react';
import { useUpdateListMutation, useDeleteListMutation } from './listApiSlice';
import { useDispatch } from 'react-redux';
import { setGlobalError } from '../globalError/globalErrorSlice';

export default function List({ list, userId }) {
  const [updateList, { isLoading: editLoading }] = useUpdateListMutation();
  const [deleteList, { isLoading: deleteLoading }] = useDeleteListMutation();
  const dispatch = useDispatch();

  // local state to manage the task text while editing
  const [listTitle, setListTitle] = React.useState(list.title);
  const [editing, setEditing] = React.useState(false);

  const handleEditListClick = () => {
    dispatch(setGlobalError(null)); // clear any existing global errors before attempting to add a list
    setEditing(!editing);
    // focus the input field when entering edit mode
  };

  const handleEditList = (e) => {
    setListTitle(e.target.value);
  };

  const handleSaveEditedListClick = async () => {
    setEditing(false);
    try {
      dispatch(setGlobalError(null)); // clear any existing global errors before attempting to add a list
      await updateList({
        listId: list._id,
        updatedFields: { title: listTitle },
        userId,
      }).unwrap();
    } catch (error) {
      dispatch(setGlobalError(error.data?.message || 'Error updating list'));
      setListTitle(list.title);
    }
  };

  const handleCancelEditedListClick = () => {
    // reset the title to the original value (derived from props) when canceling edit
    setListTitle(list.title);
    setEditing(false);
  };

  const handleDeleteListClick = async () => {
    dispatch(setGlobalError(null)); // clear any existing global errors before attempting to add a list
    try {
      await deleteList({ listId: list._id, userId }).unwrap();
    } catch (error) {
      dispatch(setGlobalError(error.data?.message || 'Error deleting list'));
    }
  };

  return (
    <>
      {deleteLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <label htmlFor={list._id}>
            {editLoading ? (
              <span className='todo-list__list-title todo-list__list-title--editLoading'>
                Loading...
              </span>
            ) : (
              <>
                {editing === true ? (
                  <input
                    type='text'
                    name='task'
                    className='todo-list__list-edit-title-input'
                    value={listTitle}
                    onChange={handleEditList}
                  />
                ) : (
                  <span className='todo-list__list-title'>{list.title}</span>
                )}
              </>
            )}
          </label>

          <div className='todo-list__list-buttons-container'>
            {editing === true ? (
              <React.Fragment>
                <button onClick={handleSaveEditedListClick}>Save</button>
                <button onClick={handleCancelEditedListClick}>Cancel</button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button onClick={handleEditListClick}>Edit</button>
                <button onClick={handleDeleteListClick}>Delete</button>
              </React.Fragment>
            )}
          </div>
        </>
      )}
    </>
  );
}
