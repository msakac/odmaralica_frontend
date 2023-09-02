import api from 'app/api';
import IResponse from 'types/IResponse';
import { IAmount, IAmountPostDTO } from 'types/amount.types';

const amountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all amounts
    getAmounts: builder.query<IResponse<IAmount[]>, null>({
      query: () => ({
        url: 'amount',
        method: 'GET',
      }),
    }),

    // Create amount
    createAmount: builder.mutation<IResponse<IAmount>, IAmountPostDTO>({
      query: (body) => ({
        url: 'amount',
        method: 'POST',
        body,
      }),
    }),

    // Get single amount
    getSingleAmount: builder.query<IResponse<IAmount>, { id: string }>({
      query: ({ id }) => ({
        url: `amount/${id}`,
        method: 'GET',
      }),
    }),

    // Update amount
    updateAmount: builder.mutation<IResponse<IAmount>, IAmount>({
      query: (body) => ({
        url: 'amount',
        method: 'PUT',
        body,
      }),
    }),

    // Delete amount
    deleteAmount: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `amount/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of amount on endpoint amount/find with request parameter q
    findAmounts: builder.query<IResponse<IAmount[]>, { q: string }>({
      query: ({ q }) => ({
        url: `amount/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetAmountsQuery,
  useCreateAmountMutation,
  useGetSingleAmountQuery,
  useUpdateAmountMutation,
  useDeleteAmountMutation,
  useFindAmountsQuery,
} = amountApi;

export default amountApi;
