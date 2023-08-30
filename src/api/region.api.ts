import api from 'app/api';
import IResponse from 'types/IResponse';
import { IRegion, IRegionPostDTO, IRegionPutDTO } from 'types/region.types';

const regionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all countries
    getRegions: builder.query<IResponse<IRegion[]>, null>({
      query: () => ({
        url: 'region',
        method: 'GET',
      }),
    }),

    // Create region
    createRegion: builder.mutation<IResponse<IRegion>, IRegionPostDTO>({
      query: (body) => ({
        url: 'region',
        method: 'POST',
        body,
      }),
    }),

    // Get single region
    getSingleRegion: builder.query<IResponse<IRegion>, { id: string }>({
      query: ({ id }) => ({
        url: `region/${id}`,
        method: 'GET',
      }),
    }),

    // Update region
    updateRegion: builder.mutation<IResponse<IRegion>, IRegionPutDTO>({
      query: (body) => ({
        url: 'region',
        method: 'PUT',
        body,
      }),
    }),

    // Delete region
    deleteRegion: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `region/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of countries on endpoint region/find with request parameter q
    findRegions: builder.query<IResponse<IRegion[]>, { q: string }>({
      query: ({ q }) => ({
        url: `region/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetRegionsQuery,
  useCreateRegionMutation,
  useGetSingleRegionQuery,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
  useFindRegionsQuery,
} = regionApi;

export default regionApi;
