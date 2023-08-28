import api from 'app/api';
import IResponse from 'Common/definitions/IResponse';
import { ICountry, ICountryPostDTO } from './address.types';

const countriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all countries
    getCountries: builder.query<IResponse<ICountry[]>, null>({
      query: () => ({
        url: 'country',
        method: 'GET',
      }),
    }),

    // Create country
    createCountry: builder.mutation<IResponse<ICountry>, ICountryPostDTO>({
      query: (body) => ({
        url: 'country',
        method: 'POST',
        body,
      }),
    }),

    // Get single country
    getSingleCountry: builder.query<IResponse<ICountry>, { id: string }>({
      query: ({ id }) => ({
        url: `country/${id}`,
        method: 'GET',
      }),
    }),

    // Update country
    updateCountry: builder.mutation<IResponse<ICountry>, { id: string; body: ICountryPostDTO }>({
      query: ({ id, body }) => ({
        url: `country/${id}`,
        method: 'PUT',
        body,
      }),
    }),

    // Delete country
    deleteCountry: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `country/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of countries on endpoint country/find with request parameter q
    findCountries: builder.query<IResponse<ICountry[]>, { q: string }>({
      query: ({ q }) => ({
        url: `country/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useCreateCountryMutation,
  useGetSingleCountryQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useFindCountriesQuery,
} = countriesApi;

export default countriesApi;
