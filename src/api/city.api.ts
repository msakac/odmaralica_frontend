import api from 'app/api';
import IResponse from 'types/IResponse';
import { ICity, ICityPostDTO, ICityPutDTO } from 'types/city.types';

const cityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all countries
    getCities: builder.query<IResponse<ICity[]>, null>({
      query: () => ({
        url: 'city',
        method: 'GET',
      }),
    }),

    // Create city
    createCity: builder.mutation<IResponse<ICity>, ICityPostDTO>({
      query: (body) => ({
        url: 'city',
        method: 'POST',
        body,
      }),
    }),

    // Get single city
    getSingleCity: builder.query<IResponse<ICity>, { id: string }>({
      query: ({ id }) => ({
        url: `city/${id}`,
        method: 'GET',
      }),
    }),

    // Update city
    updateCity: builder.mutation<IResponse<ICity>, ICityPutDTO>({
      query: (body) => ({
        url: 'city',
        method: 'PUT',
        body,
      }),
    }),

    // Delete city
    deleteCity: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `city/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of countries on endpoint city/find with request parameter q
    findCities: builder.query<IResponse<ICity[]>, { q: string }>({
      query: ({ q }) => ({
        url: `city/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useCreateCityMutation,
  useGetSingleCityQuery,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useFindCitiesQuery,
} = cityApi;

export default cityApi;
