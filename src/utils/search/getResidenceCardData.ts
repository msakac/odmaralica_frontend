/* eslint-disable default-param-last */
/* eslint-disable no-unused-vars */
import { IResidenceCardProps } from 'components/ResidenceCard';
import { IResidenceAggregateDTO } from 'types/residence.types';
import generatePriceList from 'utils/generatePriceList';
import getDatesFromInOut from './getDatesFromInOut';
import getMinimalPricePerNight from './getMinimalPricePerNight';

function getResidenceCardData(
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
  },
  reviewFilter: number
) {
  // eslint-disable-next-line prefer-const
  let cardData: IResidenceCardProps[] = [];
  const dates: string[] = getDatesFromInOut(checkIn!, checkOut!);

  residences?.forEach((residence: IResidenceAggregateDTO) => {
    console.log('RESIDENCE', residence);
    let unitsCount = 0;
    let price = { minimalPrice: 0, currency: '' };
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
      const priceList = generatePriceList(unit.pricePeriods, checkIn, checkOut);
      const minimalPrice = priceList.reduce((min, current) => {
        return current.price < min.price ? current : min;
      }, priceList[0]);
      if (price.minimalPrice === 0 || minimalPrice.price < price.minimalPrice) {
        price = { minimalPrice: minimalPrice.price, currency: minimalPrice.currency };
      }
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

    // Filter by average review
    const avgReview = residence.reviews.reduce((acc, review) => acc + review.grade, 0) / residence.reviews.length || 0;

    if (reviewFilter && avgReview < reviewFilter) return;
    if (price && unitsCount) {
      cardData.push({
        id: residence.id,
        name: residence.name,
        residenceType: residence.type.name,
        description: residence.description,
        unitsCount: `${unitsCount.toString()} ${unitsCount > 1 ? ' units' : ' unit'}`,
        price: `from ${price.minimalPrice.toString()} ${price.currency}`,
        imageId: residence.imageIds[0],
        reviewsCount: residence.reviews.length || 0,
        avgReview,
      });
    }
  });
  return cardData;
}
export default getResidenceCardData;
