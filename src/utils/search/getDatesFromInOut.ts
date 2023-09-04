import dayjs from 'dayjs';

function getDatesFromInOut(checkIn: string, checkOut: string) {
  let date = dayjs(checkIn);
  const endDate = dayjs(checkOut);
  const dates: string[] = [];

  while (date.isBefore(endDate)) {
    dates.push(date.format('YYYY-MM-DD'));
    date = date.add(1, 'day');
  }
  return dates;
}

export default getDatesFromInOut;
