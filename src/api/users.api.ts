import { IAuthenticatedUserDTO, IGetSingleUserRequest, IUser, IUserPostDTO } from 'types/users.types';
import IResponse from 'types/IResponse';
import api from '../app/api';

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create user
    createUser: builder.mutation<IResponse<IUser>, IUserPostDTO>({
      query: (body) => ({
        url: 'user',
        method: 'POST',
        body,
      }),
    }),
    // Get all users
    getUsers: builder.query<IResponse<IUser[]>, null>({
      query: () => ({
        url: 'user',
        method: 'GET',
      }),
    }),
    // Get single user
    getSingleUser: builder.query<IResponse<IAuthenticatedUserDTO>, IGetSingleUserRequest>({
      query: ({ id }) => ({
        url: `user/${id}`,
        method: 'GET',
      }),
    }),
    // Update user
    updateUser: builder.mutation<IResponse<IUser>, IUser>({
      query: (body) => ({
        url: 'user',
        method: 'PUT',
        body,
      }),
    }),
    // Delete user
    deleteUser: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `user/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  // Update country
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
export default userApi;
