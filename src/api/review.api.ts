import api from 'app/api';
import IResponse from 'types/IResponse';
import { IReview, IReviewGetDTO, IReviewPutDTO, IReviewPostDTO } from 'types/review.types';

const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reviews
    getReviews: builder.query<IResponse<IReviewGetDTO[]>, null>({
      query: () => ({
        url: 'review',
        method: 'GET',
      }),
    }),

    // Create review
    createReview: builder.mutation<IResponse<IReviewGetDTO>, IReviewPostDTO>({
      query: (body) => ({
        url: 'review',
        method: 'POST',
        body,
      }),
    }),

    // Get single review
    getSingleReview: builder.query<IResponse<IReviewGetDTO>, { id: string }>({
      query: ({ id }) => ({
        url: `review/${id}`,
        method: 'GET',
      }),
    }),

    // Update review
    updateReview: builder.mutation<IResponse<IReviewGetDTO>, IReviewPutDTO>({
      query: (body) => ({
        url: 'review',
        method: 'PUT',
        body,
      }),
    }),

    // Delete review
    deleteReview: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `review/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of review on endpoint review/find with request parameter q
    findReviews: builder.query<IResponse<IReview[]>, { q: string }>({
      query: ({ q }) => ({
        url: `review/find`,
        method: 'GET',
        params: { q },
      }),
    }),
    canReview: builder.query<IResponse<Boolean>, { userId: string; residenceId: string }>({
      query: ({ userId, residenceId }) => ({
        url: `review/can-review/${userId}/${residenceId}`,
        method: 'GET',
        params: { userId, residenceId },
      }),
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useGetSingleReviewQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useFindReviewsQuery,
  useLazyCanReviewQuery,
} = reviewApi;

export default reviewApi;
