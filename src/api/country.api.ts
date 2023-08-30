import api from 'app/api';
import IResponse from 'types/IResponse';
import { ICountry, ICountryPostDTO, ICountryRegionCityResponseDTO } from 'types/country.types';

const countriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all countries
    getCountries: builder.query<IResponse<ICountry[]>, null>({
      query: () => ({
        url: 'country',
        method: 'GET',
      }),
    }),

    // Get all countries with regions and cities
    getCountriesRegionsCities: builder.query<IResponse<ICountryRegionCityResponseDTO[]>, null>({
      query: () => ({
        url: 'country/with-regions-and-cities',
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
    deleteCountry: builder.mutation<IResponse<null>, { id: string }>({
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
  useGetCountriesRegionsCitiesQuery,
  useFindCountriesQuery,
} = countriesApi;

export default countriesApi;
