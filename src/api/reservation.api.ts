import api from 'app/api';
import IResponse from 'types/IResponse';
import { IReservation, IReservationGetDTO, IReservationPutDTO, IReservationPostDTO } from 'types/reservation.types';

const reservationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reservations
    getReservations: builder.query<IResponse<IReservationGetDTO[]>, null>({
      query: () => ({
        url: 'reservation',
        method: 'GET',
      }),
    }),

    // Create reservation
    createReservation: builder.mutation<IResponse<IReservationGetDTO>, IReservationPostDTO>({
      query: (body) => ({
        url: 'reservation',
        method: 'POST',
        body,
      }),
    }),

    // Get single reservation
    getSingleReservation: builder.query<IResponse<IReservationGetDTO>, { id: string }>({
      query: ({ id }) => ({
        url: `reservation/${id}`,
        method: 'GET',
      }),
    }),

    // Update reservation
    updateReservation: builder.mutation<IResponse<IReservationGetDTO>, IReservationPutDTO>({
      query: (body) => ({
        url: 'reservation',
        method: 'PUT',
        body,
      }),
    }),

    // Delete reservation
    deleteReservation: builder.mutation<IResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `reservation/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get List of reservation on endpoint reservation/find with request parameter q
    findReservations: builder.query<IResponse<IReservation[]>, { q: string }>({
      query: ({ q }) => ({
        url: `reservation/find`,
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetReservationsQuery,
  useCreateReservationMutation,
  useGetSingleReservationQuery,
  useUpdateReservationMutation,
  useDeleteReservationMutation,
  useFindReservationsQuery,
  useLazyFindReservationsQuery,
} = reservationApi;

export default reservationApi;
