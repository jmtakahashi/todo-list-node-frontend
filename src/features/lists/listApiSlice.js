import { apiSlice } from '../../app/api/apiSlice';

export const listApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchLists: builder.query({
      query: ({ userId }) => ({
        url: `/users/${userId}/lists`,
        validateStatus: (response, result) => {
          if (response.status === 200 && !result.error) {
            return result;
          }
          return false; 
        },
      }),
      transformResponse: (responseData) => {
        const loadedLists = responseData.lists.map((list) => ({
          ...list,
          id: list._id
        }));

        // create the RTK query normalized structure with ids and entities properties
        const normalizedData = {
          ids: loadedLists.map((list) => list.id),
          entities: loadedLists.reduce((acc, list) => {
            acc[list.id] = list;
            return acc;
          }, {}),
        };
        return normalizedData;
      },
      providesTags: (result, error) => {
        if (result?.ids) {
          // if we have a result with ids, we want to provide a tag for each todo and also a tag for the entire list
          return [
            { type: 'List', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'List', id })),
          ];
        }

        return [{ type: 'List', id: 'LIST' }];
      },
    }),
    addList: builder.mutation({
      query: ({ newList, userId }) => ({
        url: `/users/${userId}/lists`,
        method: 'POST',
        body: newList,
      }),
      invalidatesTags: [{ type: 'List', id: 'LIST' }],
    }),
    updateList: builder.mutation({
      query: ({ listId, updatedFields, userId }) => ({
        url: `/users/${userId}/lists/${listId}`,
        method: 'PATCH',
        body: updatedFields,
      }),
      invalidatesTags: (result, error, originalData) => {
        return [{ type: 'List', id: originalData.id }];
      },
    }),
    deleteList: builder.mutation({
      query: ({ listId, userId }) => ({
        url: `/users/${userId}/lists/${listId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'List', id: 'LIST'}],
    }),
  }),
});

export const {
  useFetchListsQuery,
  useAddListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
} = listApiSlice;
