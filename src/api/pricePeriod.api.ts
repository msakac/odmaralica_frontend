import api from 'app/api';
import IResponse from 'types/IResponse';
import { IPricePeriod, IPricePeriodPostDTO, IPricePeriodPutDTO } from 'types/pricePeriod.types';

const pricePeriodApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all pricePeriods
    getPricePeriods: builder.query<IResponse<IPricePeriod[]>, null>({
      query: () => ({
        url: 'price-period',
        method: 'GET',
      }),
    }),

    // Create pricePeriod
    createPricePeriod: builder.mutation<IResponse<IPricePeriod>, IPricePeriodPostDTO>({
      query: (body) => ({
        url: 'price-period',
        method: 'POST',
        body,
      }),
    }),

    // Get single pricePeriod
    getSinglePricePeriod: builder.query<IResponse<IPricePeriod>, { id: string }>({
      query: ({ id }) => ({
        url: `price-period/${id}`,
        method: 'GET',
      }),
    }),

    // Update pricePeriod
    updatePricePeriod: builder.mutation<IResponse<IPricePeriod>, IPricePeriodPutDTO>({
      query: (body) => ({
        url: 'price-period',
        method: 'PUT',
        body,
      }),
    }),

    // Delete pricePeriod
    deletePricePeriod: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `price-period/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of pricePeriod on endpoint pricePeriod/find with request parameter q
    findPricePeriods: builder.query<IResponse<IPricePeriod[]>, { q: string }>({
      query: ({ q }) => ({
        url: `price-period/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetPricePeriodsQuery,
  useCreatePricePeriodMutation,
  useGetSinglePricePeriodQuery,
  useUpdatePricePeriodMutation,
  useDeletePricePeriodMutation,
  useFindPricePeriodsQuery,
} = pricePeriodApi;

export default pricePeriodApi;
