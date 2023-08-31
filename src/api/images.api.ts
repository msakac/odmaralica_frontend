import api from 'app/api';

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
  }),
});

export const { useUploadImageMutation } = imagesApi;
export default imagesApi;
