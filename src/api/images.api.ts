import api from 'app/api';
import IResponse from 'types/IResponse';
import { ImageType } from 'types/image.types';

const imagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint za upload slike
    uploadImage: builder.mutation<any, any>({
      query: (body) => ({
        url: 'image',
        method: 'POST',
        body,
      }),
    }),
    deleteByTypeAndId: builder.mutation<IResponse<null>, { type: ImageType; id: string }>({
      query: ({ type, id }) => ({
        url: `image/${type}/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteImage: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `image/${id}`,
        method: 'DELETE',
      }),
    }),
    findImages: builder.query<IResponse<string[]>, { q: string }>({
      query: ({ q }) => ({
        url: `image/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useUploadImageMutation,
  useDeleteByTypeAndIdMutation,
  useFindImagesQuery,
  useDeleteImageMutation,
  useLazyFindImagesQuery,
} = imagesApi;
export default imagesApi;
