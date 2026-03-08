import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from '../../app/api/apiSlice';

// const initialState = {
//   todos: [],
//   status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
//   error: null,
// };

// normalize data for faster lookups
// also gives us methods to manipulate normalized data (addOne, addMany, setAll, removeOne, etc.)
const todosAdapter = createEntityAdapter();

// calling getInitialState() will create the initial state object with the following structure:
// {
//   ids: [], // array of todo ids
//   entities: {} // object with todo objects keyed by id
// }
// add extra properties to the initial state object by passing an object as an argument to getInitialState() (ex: { status: 'idle', error: null })
const initialState = todosAdapter.getInitialState({ error: null });

export const todosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchTodos: builder.query({
      query: () => '/todos',
      validateStatus: (response, result) => {
        // RTK Query considers a response valid if the status code is 200-299 and the result does not have an error property
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        // responseData is an array of todos, we want to normalize it so RTK can work with it and return the normalized state object
        const loadedUsers = responseData.map((todo) => ({
          ...todo,
          id: todo._id, // here we set id to the _id property coming from the backend
        }));
        console.log('in todosSlice.transformResponse. loadedUsers: ', loadedUsers);
        return todosAdapter.setAll(initialState, loadedUsers);
      },
      // providesTags: ['Todos'],
      providesTags: (result, error) => {
        console.log( 'in todosSlice.providesTags. result: ', result );
        if (result?.ids) {
          // if we have a result with ids, we want to provide a tag for each todo and a tag for the entire list
          return [
            { type: 'Todo', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Todo', id })),
          ];
        } else {
          // if we don't have a result, we want to provide a tag for the entire list so that it will be refetched when a new todo is added
          return [{ type: 'Todo', id: 'LIST' }];
        }
      },
      // keepUnusedDataFor: 5, // Cache data for 5 seconds (meaning we have to leave the component for 5 seconds before refetching data)
    }),
    addTodo: builder.mutation({
      query: (newTodo) => ({
        url: '/todos',
        method: 'POST',
        body: newTodo,
      }),
      // if a func is passed instead of an array, we can be more specific about which tags to invalidate
      // (ex: only invalidate the tag for the specific todo that was updated instead of all todos)
      // the func receives the result of the mutation (the new todo that was created), an error if request failed and an arg that
      // was passed to the mutation when it was called (ie. the new todo data that we sent in the request body).
      // we can use that to determine which tags to invalidate
      invalidatesTags: [
        { type: 'Todo', id: 'LIST' },
      ],
    }),
    // TODO: might need to check this method
    updateTodo: builder.mutation({
      query: ({ id, updatedFields }) => ({
        url: `/todos/${id}`,
        method: 'PATCH',
        body: updatedFields,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg.id }],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg.id }],
    }),
  }),
});

// these hooks are auto-generated based on the defined endpoints
// (if its a mutation endpoint, we use `use[EndpointName]Mutation`,
// if it's a query endpoint, we use `use[EndpointName]Query`)
export const {
  useFetchTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApiSlice;

// returns the query result object (entire result object, not just data)
export const selectTodosResult = todosApiSlice.endpoints.fetchTodos.select();

// creates memoized selector
// createSelector(inputFunc, outputFunc)
const selectTodosData = createSelector(
  selectTodosResult,
  (todosResult) => todosResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
  selectIds: selectTodoIds, // use if we want to get only ids instead of entire todo objects
} = todosAdapter.getSelectors(state => selectTodosData(state) ?? initialState);
