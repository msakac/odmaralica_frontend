import dayjs from 'dayjs';
import { IReservationGetDTO } from 'types/reservation.types';

const getReservationStatus = (r: IReservationGetDTO) => {
  // if reservation is cancelled return cancelled
  if (r.cancelled) return 'Cancelled';
  // if reservation endAt is in the past return finished
  if (dayjs(r.endAt).isBefore(dayjs())) return 'Finished';
  // if reservation startAt is in the future return pending
  if (dayjs(r.startAt).isAfter(dayjs())) return 'Upcoming';
  // if reservation startAt is in the past and endAt is in the future return active
  if (dayjs(r.startAt).isBefore(dayjs()) && dayjs(r.endAt).isAfter(dayjs())) return 'Active';
  return 'Unknown';
};

export default getReservationStatus;
