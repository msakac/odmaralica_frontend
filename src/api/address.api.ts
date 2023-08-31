import api from 'app/api';
import IResponse from 'types/IResponse';
import { IAddress, IAddressPostDTO, IAddressPutDTO } from 'types/address.types';

const addressApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all countries
    getAddresses: builder.query<IResponse<IAddress[]>, null>({
      query: () => ({
        url: 'address',
        method: 'GET',
      }),
    }),

    // Create address
    createAddress: builder.mutation<IResponse<IAddress>, IAddressPostDTO>({
      query: (body) => ({
        url: 'address',
        method: 'POST',
        body,
      }),
    }),

    // Get single address
    getSingleAddress: builder.query<IResponse<IAddress>, { id: string }>({
      query: ({ id }) => ({
        url: `address/${id}`,
        method: 'GET',
      }),
    }),

    // Update address
    updateAddress: builder.mutation<IResponse<IAddress>, IAddressPutDTO>({
      query: (body) => ({
        url: 'address',
        method: 'PUT',
        body,
      }),
    }),

    // Delete address
    deleteAddress: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `address/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of address on endpoint address/find with request parameter q
    findAddress: builder.query<IResponse<IAddress[]>, { q: string }>({
      query: ({ q }) => ({
        url: `address/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useGetSingleAddressQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useFindAddressQuery,
} = addressApi;

export default addressApi;
