import dayjs from 'dayjs';
import { ICustomPricePeriodDTO } from 'types/ICustomPricePeriodDTO';

function getMinimalPricePerNight(pricePeriods: ICustomPricePeriodDTO[], checkIn: string, checkOut: string) {
  let minimalPrice = Infinity;
  let currency = '';

  pricePeriods.forEach((period) => {
    const periodStart = dayjs(period.startAt);
    const periodEnd = dayjs(period.endAt);
    const price = parseFloat(period.amount.amount);

    const checkInDate = dayjs(checkIn);
    const checkOutDate = dayjs(checkOut);

    if (
      ((checkInDate.isAfter(periodStart) || checkInDate.isSame(periodStart)) &&
        (checkInDate.isBefore(periodEnd) || checkInDate.isSame(periodEnd))) ||
      ((checkOutDate.isAfter(periodStart) || checkOutDate.isSame(periodStart)) &&
        (checkOutDate.isBefore(periodEnd) || checkOutDate.isSame(periodEnd)))
    ) {
      minimalPrice = price;
      currency = period.amount.currency;
    }
  });
  return { minimalPrice, currency };
}

export default getMinimalPricePerNight;
