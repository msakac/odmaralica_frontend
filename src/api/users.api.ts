import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwtDecode from 'jwt-decode';
import {
  IAuthenticatedUserDTO,
  ICreateUserRequest,
  IDeleteUserRequest,
  IGetSingleUserRequest,
  IGetUsersRequestParams,
  IUpdateUserRequest,
  IUser,
} from 'types/users.types';
import IResponse from 'types/IResponse';
import IJWT from 'types/IJWT';
import IQueryResults from 'types/IQueryResults';
import api from '../app/api';

const apiWithUserTags = api.enhanceEndpoints({ addTagTypes: ['User'] });

const userApi = apiWithUserTags.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<IAuthenticatedUserDTO, ICreateUserRequest>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    getUsers: builder.query<IQueryResults<IAuthenticatedUserDTO>, IGetUsersRequestParams>({
      query: (params) => ({
        url: 'users',
        method: 'GET',
        params,
      }),
      providesTags: (data) =>
        data && data.results
          ? [...data.results.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'PARTIAL-USER-LIST' }]
          : [{ type: 'User', id: 'PARTIAL-USER-LIST' }],
    }),
    getSingleUser: builder.query<IResponse<IAuthenticatedUserDTO>, IGetSingleUserRequest>({
      query: ({ id }) => ({
        url: `user/${id}`,
        method: 'GET',
      }),
      providesTags: (result) => (result ? [{ type: 'User', id: result.data.id }] : ['User']),
    }),
    updateUser: builder.mutation<IAuthenticatedUserDTO, IUpdateUserRequest>({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'User', id: arg.id },
        { type: 'User', id: 'PARTIAL-USER-LIST' },
      ],
    }),
    deleteUser: builder.mutation<void, IDeleteUserRequest>({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'User', id: arg.id },
        { type: 'User', id: 'PARTIAL-USER-LIST' },
      ],
    }),
  }),
});

// Selectors
// TODO: fix selectUsers > always returns undefined
export const selectUsers = userApi.endpoints.getUsers.select({});
export const selectUserById = (id: IUser['id']) => userApi.endpoints.getSingleUser.select({ id });
export const selectUserFromList = (id: IUser['id']) =>
  createSelector(selectUsers, (response) => response.data?.results.find((user) => user.id === id));

export const getLoggedInUser = (): IAuthenticatedUserDTO | null => {
  let user: IAuthenticatedUserDTO | null = null;
  const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  let id = '';
  if (token) {
    const decodedToken = jwtDecode<IJWT>(token);
    id = decodedToken.sub;
  }

  if (id) {
    const { data } = useSelector(selectUserById(id));
    if (data) {
      user = data.data;
    }
  }

  return user;
};

export const getUserById = (id: IUser['id']): IAuthenticatedUserDTO | undefined => {
  const { data } = useSelector(selectUserById(id));
  return data!.data;
};

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
export default userApi;

export const useCurrentUser = () => {
  let user: IAuthenticatedUserDTO | null = null;
  const id = sessionStorage.getItem('userId') || localStorage.getItem('userId');
  if (id) {
    const { data } = useGetSingleUserQuery({ id });
    if (data) {
      user = data.data;
    }
  }
  return user;
};
