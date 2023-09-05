/* eslint-disable default-param-last */
/* eslint-disable no-unused-vars */
import { IResidenceCardProps } from 'components/ResidenceCard';
import { IResidenceAggregateDTO } from 'types/residence.types';
import getDatesFromInOut from './getDatesFromInOut';
import getMinimalPricePerNight from './getMinimalPricePerNight';

function getCardData(
  checkIn: string,
  checkOut: string,
  residences: IResidenceAggregateDTO[],
  location: {
    country: string;
    region: string;
    city: string;
  },
  type = 'all',
  budgetFilter: {
    min: number;
    max: number;
    enabled: boolean;
  }[],
  searchByName: '' | string,
  facilitiesFilter: {
    wifi: boolean;
    parking: boolean;
    airconditioning: boolean;
  }
) {
  // eslint-disable-next-line prefer-const
  let cardData: IResidenceCardProps[] = [];
  const dates: string[] = getDatesFromInOut(checkIn!, checkOut!);

  let unitsCount = 0;
  let price = { minimalPrice: 0, currency: '' };
  residences?.forEach((residence: IResidenceAggregateDTO) => {
    // Filter by facilities
    if (facilitiesFilter.wifi && !residence.isWifiFree) return;
    if (facilitiesFilter.parking && !residence.isParkingFree) return;
    if (facilitiesFilter.airconditioning && !residence.isAirConFree) return;

    // Filter by name
    if (searchByName && !residence.name.toLowerCase().includes(searchByName.toLowerCase())) return;

    // Filter by location
    const cityId = residence.address.city.id;
    const regionId = residence.address.city.region.id;
    const countryId = residence.address.city.region.country.id;
    if (location.city && location.city !== cityId) return;
    if (location.region && location.region !== regionId) return;
    if (location.country && location.country !== countryId) return;

    // Filter by type
    if (type !== 'all' && residence.type.id !== type) return;

    // Filter by availability
    residence.units.forEach((unit) => {
      const unitIsAvailable = dates.every((date) => unit.availableDates.includes(date));
      if (!unitIsAvailable) return;
      unitsCount += 1;
      price = getMinimalPricePerNight(unit.pricePeriods, checkIn!, checkOut!);
    });

    // Filter by budget
    let isInBudget = false;
    const enabledBudgets = budgetFilter.filter((filter) => filter.enabled);

    if (enabledBudgets.length === 0) {
      isInBudget = true;
    } else {
      enabledBudgets.forEach((budget) => {
        if (price.minimalPrice >= budget.min && price.minimalPrice <= budget.max && !isInBudget) {
          isInBudget = true;
        }
      });
    }
    if (!isInBudget) return;

    if (price && unitsCount) {
      cardData.push({
        id: residence.id,
        name: residence.name,
        residenceType: residence.type.name,
        description: residence.description,
        unitsCount: `${unitsCount.toString()} ${unitsCount > 1 ? ' units' : ' unit'}`,
        price: `from ${price.minimalPrice.toString()} ${price.currency}`,
        reviewsCount: 666,
        avgReview: 4.5,
        imageId: residence.imageIds[0],
      });
    }
  });
  return cardData;
}
export default getCardData;
