import api from 'app/api';
import IResponse from 'types/IResponse';
import { ILogEncryptedGetDTO, ILogGetDTO } from 'types/log.types';

const logApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query<IResponse<ILogGetDTO[]>, null>({
      query: () => ({
        url: 'log',
        method: 'GET',
      }),
    }),
    getEncryptedLogs: builder.query<IResponse<ILogEncryptedGetDTO[]>, null>({
      query: () => ({
        url: 'log/encrypted',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetLogsQuery, useGetEncryptedLogsQuery } = logApi;
export default logApi;
