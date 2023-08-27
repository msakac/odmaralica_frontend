import api from 'app/api';

const apiWithAuthTags = api.enhanceEndpoints({ addTagTypes: ['Image'] });

const authApi = apiWithAuthTags.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<any, any>({
      query: (body) => ({
        url: 'image',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Image'],
    }),
    getImage: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `image/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useUploadImageMutation, useGetImageQuery } = authApi;
export default authApi;
