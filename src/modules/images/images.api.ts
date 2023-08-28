import api from 'app/api';

const imagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<any, any>({
      query: (body) => ({
        url: 'image',
        method: 'POST',
        body,
      }),
    }),
    getImage: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `image/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useUploadImageMutation, useGetImageQuery } = imagesApi;
export default imagesApi;
