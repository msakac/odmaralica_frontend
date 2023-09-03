/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useGetCountriesRegionsCitiesQuery } from 'api/country.api';
import { useGetAggregateResidenceesQuery } from 'api/residence.api';
import ImageCardWrap from 'components/ImageCardWrap';
import ResidenceCard from 'components/ResidenceCard';
import Animate from 'components/common/Animate';
import Dropdown from 'components/common/Dropdown';
import Loader from 'components/common/Loader';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { ICustomPricePeriodDTO } from 'types/ICustomPricePeriodDTO';
import { IDropdown } from 'types/IDropdown.types';
import { ICountryRegionCityResponseDTO, ICustomCityDTO, ICustomRegionDTO } from 'types/country.types';
import { IResidenceAggregateDTO } from 'types/residence.types';
// TODO dobiti minimalnu cijenu apartmana
const Explore = () => {
  const { data: residences, isLoading, isFetching } = useGetAggregateResidenceesQuery(null);
  const { data: countryRegionCities, isLoading: isLoadC, isFetching: isFetchC } = useGetCountriesRegionsCitiesQuery(null);
  const [regionDropdownData, setRegionDropdownData] = useState<IDropdown[]>([]);
  const [cityDropdownData, setCityDropdownData] = useState<IDropdown[]>([]);
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState<string | undefined>('');
  const [checkOut, setCheckOut] = useState<string | undefined>('');
  // const [residenceCardData, setResidenceCardData] = useState<IResidenceCardProps[]>([]);

  const onSearch = () => {
    // let residencesCardData: IResidenceCardProps[] = [];
    /* Workflow:
      1. Kad dojdem na page, datumi nisu setirani i za svaki residence izvlacim najmanju cijenu po nocenju
      2. Ako dojdem na page sa preselektiranom drzavom trebam traziti po toj drzavi
      3. Prilikom setiranja datauma, prvo provjeravam da li bilo koj residence ima slobodnih soba u tom periodu, ako ne izbacima ga
      4. Ako ima sobu ili sobe u tom periodu, izvlacim najmanju cijenu po nocenju
    */
    function calculateTotalPrice(pricePeriods: ICustomPricePeriodDTO[], checkIn: string, checkOut: string) {
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

    function generatePriceList(pricePeriods: any[]) {
      const priceList: any[] = [];

      pricePeriods.forEach((period) => {
        const startDate = new Date(period.startAt);
        const endDate = new Date(period.endAt);
        const price = parseFloat(period.amount.amount);
        const { currency } = period.amount;

        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
          priceList.push({ date: dateStr, price, currency });
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
      });

      return priceList;
    }

    let date = dayjs(checkIn);
    const endDate = dayjs(checkOut);
    const dates: string[] = [];

    // Get all dates between checkIn and checkOut
    while (date.isBefore(endDate)) {
      dates.push(date.format('YYYY-MM-DD'));
      date = date.add(1, 'day');
    }
    let units = 0;
    const prices = [];
    residences?.data.forEach((residence: IResidenceAggregateDTO) => {
      residence.units.forEach((unit) => {
        const unitIsAvailable = dates.every((date) => unit.availableDates.includes(date));
        if (!unitIsAvailable) return;
        units += 1;
        const price = calculateTotalPrice(unit.pricePeriods, checkIn!, checkOut!);
        prices.push(price);
        console.log(unit.name, price);
      });
    });
  };

  useEffect(() => {
    const countryRegions = countryRegionCities?.data.find((c: ICountryRegionCityResponseDTO) => c.id === country)?.regions;
    const regionDropdownOptions = countryRegions?.map((c: ICustomRegionDTO) => {
      return { id: c.id, name: c.name };
    });
    setRegionDropdownData(regionDropdownOptions || []);

    const regionCities = countryRegions?.find((r: ICustomRegionDTO) => r.id === region)?.cities;
    const cityDropdownOptions = regionCities?.map((c: ICustomCityDTO) => {
      return { id: c.id, name: c.name };
    });
    setCityDropdownData(cityDropdownOptions || []);
  }, [country, region]);

  const countryDropdownOptions = countryRegionCities?.data.map((c: ICountryRegionCityResponseDTO) => {
    return { id: c.id, name: c.name };
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Loader show={isLoading || isFetching || isLoadC || isFetchC} />
      <div className="p-4 mt-3 residence-search-outer-wrap d-flex flex-column">
        <Row className="residence-search-inner-wrap">
          <Col>
            <Dropdown value={country} size="medium" setValue={setCountry} label="Country" options={countryDropdownOptions} />
          </Col>
          <Col>
            <Dropdown
              size="medium"
              value={region}
              setValue={setRegion}
              label="Region"
              options={regionDropdownData}
              disabled={regionDropdownData.length === 0}
            />
          </Col>
          <Col>
            <Dropdown
              size="medium"
              value={city}
              setValue={setCity}
              label="City"
              options={cityDropdownData}
              disabled={cityDropdownData.length === 0}
            />
          </Col>
          <Col>
            <DatePicker
              label="Check-in"
              className="w-100"
              value={dayjs(checkIn)}
              onChange={(e) => setCheckIn(dayjs(e!).format('YYYY-MM-DD'))}
            />
          </Col>
          <Col>
            <DatePicker
              label="Check-out"
              className="w-100"
              value={dayjs(checkOut)}
              onChange={(e) => setCheckOut(dayjs(e!).format('YYYY-MM-DD'))}
            />
          </Col>
        </Row>
        <Row className="justify-content-center ">
          <Col sm={12} lg={6}>
            <Button variant="primary" type="submit" className="w-100 search-button" onClick={onSearch}>
              Search
            </Button>
          </Col>
        </Row>
      </div>
      <div className="my-3 d-flex flex-column  gap-4">
        {residences?.data.map((residence: IResidenceAggregateDTO) => (
          <ResidenceCard
            id={residence.id}
            name={residence.name}
            residenceType={residence.type.name}
            description={residence.description}
            unitsCount={`${residence.units.length} ${residence.units.length === 1 ? 'unit' : 'units'}`}
            price={`from ${residence.units[0].pricePeriods[0].amount.amount} ${residence.units[0].pricePeriods[0].amount.currency}`}
            reviewsCount={666}
            avgReview={4.5}
            imageId={residence.imageIds[0]}
          />
        ))}
      </div>
      <Animate>
        <ImageCardWrap />
      </Animate>
    </LocalizationProvider>
  );
};

export default Explore;
