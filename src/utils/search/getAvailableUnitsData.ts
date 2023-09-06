/* eslint-disable default-param-last */
/* eslint-disable no-unused-vars */
import { IResidenceCardProps } from 'components/ResidenceCard';
import { IResidenceAggregateDTO } from 'types/residence.types';
import { ICustomAccommodationUnitDTO } from 'types/accommodationUnit.types';
import getDatesFromInOut from './getDatesFromInOut';
import getMinimalPricePerNight from './getMinimalPricePerNight';

function getAvailableUnitsData(residence: IResidenceAggregateDTO, checkIn: string, checkOut: string) {
  // eslint-disable-next-line prefer-const
  let availableUnits: ICustomAccommodationUnitDTO[] = [];
  const dates: string[] = getDatesFromInOut(checkIn!, checkOut!);
  console.log(dates);
  // Filter by availability
  residence.units.forEach((unit) => {
    console.log(unit);
    const unitIsAvailable = dates.every((date) => unit.availableDates.includes(date));
    if (!unitIsAvailable) return;
    availableUnits.push(unit);
  });

  return availableUnits;
}
export default getAvailableUnitsData;
