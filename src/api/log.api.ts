import api from 'app/api';
import IResponse from 'types/IResponse';
import { ILogGetDTO } from 'types/log.types';

const logApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query<IResponse<ILogGetDTO[]>, null>({
      query: () => ({
        url: 'log',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetLogsQuery } = logApi;
export default logApi;
