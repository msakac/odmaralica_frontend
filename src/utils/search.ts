import { ICustomPricePeriodDTO } from 'types/ICustomPricePeriodDTO';

export function calculateTotalPrice(pricePeriods: ICustomPricePeriodDTO[], checkIn: string, checkOut: string) {
  let totalPrice = 0;

  pricePeriods.forEach((period) => {
    const periodStart = new Date(period.startAt).getTime();
    const periodEnd = new Date(period.endAt).getTime() - 24 * 60 * 60 * 1000;
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();

    // Check if the period overlaps with the check-in/check-out range
    if (periodStart <= checkOutTime && periodEnd >= checkInTime) {
      // Calculate the overlapping days
      const start = Math.max(periodStart, checkInTime);
      const end = Math.min(periodEnd, checkOutTime);
      const daysInPeriod = (end - start) / (1000 * 60 * 60 * 24) + 1;

      // Parse the price to a numeric type (e.g., number)
      const price = parseFloat(period.amount.amount);

      // Check if price is a valid number (not NaN)
      if (!Number.isNaN(price)) {
        totalPrice += price * daysInPeriod;
      }
    }
  });

  return totalPrice;
}
export default calculateTotalPrice;
