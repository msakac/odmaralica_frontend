import api from 'app/api';
import IResponse from 'types/IResponse';
import { IResidenceType, IResidenceTypePostDTO } from 'types/residence.types';

const residenceTypeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all countries
    getResidenceTypees: builder.query<IResponse<IResidenceType[]>, null>({
      query: () => ({
        url: 'residence-type',
        method: 'GET',
      }),
    }),

    // Create residenceType
    createResidenceType: builder.mutation<IResponse<IResidenceType>, IResidenceTypePostDTO>({
      query: (body) => ({
        url: 'residence-type',
        method: 'POST',
        body,
      }),
    }),

    // Get single residenceType
    getSingleResidenceType: builder.query<IResponse<IResidenceType>, { id: string }>({
      query: ({ id }) => ({
        url: `residence-type/${id}`,
        method: 'GET',
      }),
    }),

    // Update residenceType
    updateResidenceType: builder.mutation<IResponse<IResidenceType>, IResidenceType>({
      query: (body) => ({
        url: 'residence-type',
        method: 'PUT',
        body,
      }),
    }),

    // Delete residenceType
    deleteResidenceType: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `residence-type/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of residenceType on endpoint residenceType/find with request parameter q
    findCities: builder.query<IResponse<IResidenceType[]>, { q: string }>({
      query: ({ q }) => ({
        url: `residence-type/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetResidenceTypeesQuery,
  useCreateResidenceTypeMutation,
  useGetSingleResidenceTypeQuery,
  useUpdateResidenceTypeMutation,
  useDeleteResidenceTypeMutation,
  useFindCitiesQuery,
} = residenceTypeApi;

export default residenceTypeApi;
