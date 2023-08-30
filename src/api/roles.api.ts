import api from 'app/api';
import IResponse from 'types/IResponse';
import { IRole } from 'types/role.types';

const rolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<IResponse<IRole[]>, null>({
      query: () => ({
        url: 'role',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetRolesQuery } = rolesApi;
export default rolesApi;
