import api from 'app/api';
import IResponse from 'types/IResponse';
import { IResidence, IResidenceAggregateDTO, IResidencePostDTO, IResidencePutDTO } from 'types/residence.types';

const residenceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all countries
    getResidencees: builder.query<IResponse<IResidence[]>, null>({
      query: () => ({
        url: 'residence',
        method: 'GET',
      }),
    }),

    // Create residence
    createResidence: builder.mutation<IResponse<IResidence>, IResidencePostDTO>({
      query: (body) => ({
        url: 'residence',
        method: 'POST',
        body,
      }),
    }),

    // Get single residence
    getSingleResidence: builder.query<IResponse<IResidence>, { id: string }>({
      query: ({ id }) => ({
        url: `residence/${id}`,
        method: 'GET',
      }),
    }),

    // Update residence
    updateResidence: builder.mutation<IResponse<IResidence>, IResidencePutDTO>({
      query: (body) => ({
        url: 'residence',
        method: 'PUT',
        body,
      }),
    }),

    // Delete residence
    deleteResidence: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `residence/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of residence on endpoint residence/find with request parameter q
    findResidence: builder.query<IResponse<IResidence[]>, { q: string }>({
      query: ({ q }) => ({
        url: `residence/find`,
        method: 'GET',
        params: { q },
      }),
    }),
    getAggregateResidencees: builder.query<IResponse<IResidenceAggregateDTO[]>, null>({
      query: () => ({
        url: 'residence/aggregate',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetResidenceesQuery,
  useCreateResidenceMutation,
  useGetSingleResidenceQuery,
  useUpdateResidenceMutation,
  useDeleteResidenceMutation,
  useFindResidenceQuery,
  useGetAggregateResidenceesQuery,
} = residenceApi;

export default residenceApi;
