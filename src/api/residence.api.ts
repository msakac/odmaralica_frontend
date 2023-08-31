import api from 'app/api';
import IResponse from 'types/IResponse';
import { IResidence, IResidencePostDTO, IResidencePutDTO } from 'types/residence.types';

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
    findCities: builder.query<IResponse<IResidence[]>, { q: string }>({
      query: ({ q }) => ({
        url: `residence/find`,
        method: 'GET',
        params: { q },
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
  useFindCitiesQuery,
} = residenceApi;

export default residenceApi;
