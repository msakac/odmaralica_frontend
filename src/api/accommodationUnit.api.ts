import api from 'app/api';
import IResponse from 'types/IResponse';
import {
  IAccommodationUnitGetDTO,
  IAccommodationUnitPostDTO,
  IAccommodationUnitPutDTO,
} from 'types/accommodationUnit.types';

const accommodationUnitApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all acc units
    getAccommodationUnits: builder.query<IResponse<IAccommodationUnitGetDTO[]>, null>({
      query: () => ({
        url: 'accommodation-unit',
        method: 'GET',
      }),
    }),

    // Create accommodationUnit
    createAccommodationUnit: builder.mutation<IResponse<IAccommodationUnitGetDTO>, IAccommodationUnitPostDTO>({
      query: (body) => ({
        url: 'accommodation-unit',
        method: 'POST',
        body,
      }),
    }),

    // Get single accommodationUnit
    getSingleAccommodationUnit: builder.query<IResponse<IAccommodationUnitGetDTO>, { id: string }>({
      query: ({ id }) => ({
        url: `accommodation-unit/${id}`,
        method: 'GET',
      }),
    }),

    // Update accommodationUnit
    updateAccommodationUnit: builder.mutation<IResponse<IAccommodationUnitGetDTO>, IAccommodationUnitPutDTO>({
      query: (body) => ({
        url: 'accommodation-unit',
        method: 'PUT',
        body,
      }),
    }),

    // Delete accommodationUnit
    deleteAccommodationUnit: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `accommodation-unit/${id}`,
        method: 'DELETE',
      }),
    }),

    findAccommodationUnits: builder.query<IResponse<IAccommodationUnitGetDTO[]>, { q: string }>({
      query: ({ q }) => ({
        url: `accommodation-unit/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetAccommodationUnitsQuery,
  useCreateAccommodationUnitMutation,
  useGetSingleAccommodationUnitQuery,
  useUpdateAccommodationUnitMutation,
  useFindAccommodationUnitsQuery,
  useDeleteAccommodationUnitMutation,
} = accommodationUnitApi;

export default accommodationUnitApi;
