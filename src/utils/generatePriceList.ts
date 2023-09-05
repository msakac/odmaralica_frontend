import dayjs from 'dayjs';
import getDatesFromInOut from './search/getDatesFromInOut';

export interface PriceList {
  date: string;
  price: number;
  currency: string;
}

function generatePriceList(pricePeriods: any[], checkIn: string, checkOut: string) {
  const priceList: PriceList[] = [];
  const stays = getDatesFromInOut(checkIn, checkOut);
  pricePeriods.forEach((period) => {
    const startDate = dayjs(period.startAt);
    const endDate = dayjs(period.endAt);
    const price = parseFloat(period.amount.amount);
    const { currency } = period.amount;

    let currentDate = dayjs(startDate);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      const dateStr = currentDate.format('YYYY-MM-DD'); // Format as "YYYY-MM-DD"
      //   if (dateStr >= checkIn && dateStr <= checkOut) {
      //     priceList.push({ date: dateStr, price, currency });
      //   }
      if (stays.includes(dateStr)) {
        priceList.push({ date: dateStr, price, currency });
      }
      currentDate = currentDate.add(1, 'day');
    }
  });

  return priceList;
}
export default generatePriceList;

// import dayjs from 'dayjs';

// function getDatesFromInOut(checkIn: string, checkOut: string) {
//   let date = dayjs(checkIn);
//   const endDate = dayjs(checkOut);
//   const dates: string[] = [];

//   while (date.isBefore(endDate)) {
//     dates.push(date.format('YYYY-MM-DD'));
//     date = date.add(1, 'day');
//   }
//   return dates;
// }

// export default getDatesFromInOut;
