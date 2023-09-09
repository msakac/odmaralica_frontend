import api from 'app/api';
import IResponse from 'types/IResponse';
import { IPrivacyRequestGetDTO, IPrivacyRequestPutDTO, IPrivacyRequestPostDTO } from 'types/privacyRequest.types';

const privacyRequestApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all privacyRequests
    getPrivacyRequests: builder.query<IResponse<IPrivacyRequestGetDTO[]>, null>({
      query: () => ({
        url: 'privacy-request',
        method: 'GET',
      }),
    }),

    // Create privacyRequest
    createPrivacyRequest: builder.mutation<IResponse<IPrivacyRequestGetDTO>, IPrivacyRequestPostDTO>({
      query: (body) => ({
        url: 'privacy-request',
        method: 'POST',
        body,
      }),
    }),

    // Create privacyRequest
    updateAcceptPrivacyRequest: builder.mutation<IResponse<IPrivacyRequestGetDTO>, { id: string }>({
      query: ({ id }) => ({
        url: `privacy-request/accept/${id}`,
        method: 'PUT',
      }),
    }),

    // Get single privacyRequest
    getSinglePrivacyRequest: builder.query<IResponse<IPrivacyRequestGetDTO>, { id: string }>({
      query: ({ id }) => ({
        url: `privacy-request/${id}`,
        method: 'GET',
      }),
    }),

    // Update privacyRequest
    updatePrivacyRequest: builder.mutation<IResponse<IPrivacyRequestGetDTO>, IPrivacyRequestPutDTO>({
      query: (body) => ({
        url: 'privacy-request',
        method: 'PUT',
        body,
      }),
    }),

    // Delete privacyRequest
    deletePrivacyRequest: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `privacy-request/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of privacyRequest on endpoint privacyRequest/find with request parameter q
    findPrivacyRequests: builder.query<IResponse<IPrivacyRequestGetDTO[]>, { q: string }>({
      query: ({ q }) => ({
        url: `privacy-request/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetPrivacyRequestsQuery,
  useCreatePrivacyRequestMutation,
  useGetSinglePrivacyRequestQuery,
  useUpdatePrivacyRequestMutation,
  useDeletePrivacyRequestMutation,
  useFindPrivacyRequestsQuery,
  useUpdateAcceptPrivacyRequestMutation,
} = privacyRequestApi;

export default privacyRequestApi;
