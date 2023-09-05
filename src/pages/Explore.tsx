/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import { InputAdornment, SwipeableDrawer, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Button, Image } from 'react-bootstrap';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useGetCountriesRegionsCitiesQuery } from 'api/country.api';
import { useGetAggregateResidenceesQuery } from 'api/residence.api';
import { useGetResidenceTypeesQuery } from 'api/residenceTypes.api';
import ResidenceCard, { IResidenceCardProps } from 'components/ResidenceCard';
import SearchBox from 'components/SearchBox';
import Loader from 'components/common/Loader';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { IDropdown } from 'types/IDropdown.types';
import { ICountryRegionCityResponseDTO, ICustomCityDTO, ICustomRegionDTO } from 'types/country.types';
import { IResidenceType } from 'types/residence.types';
import getCardData from 'utils/search/getResidenceCardData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import useDebounce from 'hooks/useDebounce';
import FilterBox from 'components/FilterBox';
import NoResultImage from '../assets/img/illustrations/noResults.svg';

const budgetOptions = [
  { min: 0, max: 200, enabled: false },
  { min: 200, max: 500, enabled: false },
  { min: 500, max: 1000, enabled: false },
  { min: 1000, max: 2000, enabled: false },
  { min: 2000, max: 5000, enabled: false },
];

// TODO sloziti na backendu da mi je pricePeriod 1.10 - 31.10 i 1.11 - x
// TODO sloziti filtriranje po rejtingu
// TODO mozda dodati gumb za resetiranje stanja filtera
const Explore = () => {
  // TODO dobiti dateum ako postoje iz query parama ili location statea
  const checkInDate = dayjs().add(4, 'day').format('YYYY-MM-DD');
  const checkOutDate = dayjs().add(11, 'day').format('YYYY-MM-DD');
  const { data: residences, isLoading, isFetching } = useGetAggregateResidenceesQuery(null);
  const [residenceCardsData, setResidenceCardsData] = useState<IResidenceCardProps[]>([]);
  const { data: countryRegionCities, isLoading: isLoadC, isFetching: isFetchC } = useGetCountriesRegionsCitiesQuery(null);
  const { data: residenceTypes, isLoading: isLoadRT, isFetching: isFetchRT } = useGetResidenceTypeesQuery(null);
  const [location, setLocation] = useState({ country: '', region: '', city: '' });
  const [checkIn, setCheckIn] = useState<string>(checkInDate);
  const [checkOut, setCheckOut] = useState<string>(checkOutDate);
  const [regionDropdownData, setRegionDropdownData] = useState<IDropdown[]>([]);
  const [cityDropdownData, setCityDropdownData] = useState<IDropdown[]>([]);
  const [titleText, setTitleText] = useState<string>('');
  const [type, setType] = useState<string>('all');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [budgetFilter, setBudgetFilter] = useState(budgetOptions);
  const [reviewFilter, setReviewFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchByName, setSearchByName] = useState('');
  const [facilitiesFilter, setFacilitiesFilter] = useState({
    wifi: false,
    parking: false,
    airconditioning: false,
  });
  useDebounce(() => setSearchByName(searchInput), 500, [searchInput]);

  /* Workflow v2: */
  /* 1. Kad dojdem na page setirani su mi checkIn now + 4 dana i Out now + 11 dana  */
  /* 2. Na homepageu imal budem cardove za Country, Region, City. 
        Kad stisnem na neki od njih navigira me na ovaj page i u locationStateu budem imal ili ne
        country, region i city. Prema njima setiram gore state. */
  /* 3. Filtiranje: 
          1. Provjeravam za svaki unit od residencea da li ima slobodno u odabranom terminu 
          2. Za one residence koji su slobodni (imaju unit u terminu) provjeravam drzavu, regiju i grad ako su setirani 
          3. Izvlacim broj unita i minimalnu cijenu po nocenju. Minimalna cijena ja najmanja cijenu u odabranom intervalu 
          4. Filtriranje po ostalima TODO */

  /* Change regions and cities dropdown */
  useEffect(() => {
    const countryRegions = countryRegionCities?.data.find(
      (c: ICountryRegionCityResponseDTO) => c.id === location.country
    )?.regions;
    const regionDropdownOptions = countryRegions?.map((c: ICustomRegionDTO) => {
      return { id: c.id, name: c.name };
    });
    setRegionDropdownData(regionDropdownOptions || []);

    const regionCities = countryRegions?.find((r: ICustomRegionDTO) => r.id === location.region)?.cities;
    const cityDropdownOptions = regionCities?.map((c: ICustomCityDTO) => {
      return { id: c.id, name: c.name };
    });
    setCityDropdownData(cityDropdownOptions || []);
  }, [location.country, location.region]);

  // Create country dropdown options
  const countryDropdownOptions = countryRegionCities?.data.map((c: ICountryRegionCityResponseDTO) => {
    return { id: c.id, name: c.name };
  });

  // Creates title text
  const getTitleText = (count: number) => {
    let place = '';
    if (location.city) {
      place = cityDropdownData.find((c) => c.id === location.city)?.name || '';
    } else if (location.region) {
      place = regionDropdownData.find((c) => c.id === location.region)?.name || '';
    } else if (location.country) {
      place = countryDropdownOptions?.find((c) => c.id === location.country)?.name || '';
    }
    return place ? `${place}: ${count} search results found` : `${count} search results found`;
  };

  // Used for filtering and searching
  const changeDataState = () => {
    const cardData = getCardData(
      checkIn,
      checkOut,
      residences?.data!,
      location,
      type,
      budgetFilter,
      searchByName,
      facilitiesFilter
    );
    setResidenceCardsData(cardData);
    setTitleText(getTitleText(cardData.length));
  };

  // Change data when state changes
  useEffect(() => {
    changeDataState();
  }, [residences, type, budgetFilter, searchByName, facilitiesFilter]);

  // Change data when location and dates are submited
  const searchData = () => {
    changeDataState();
  };

  // Handle residence type toggle
  const handleTypeToggle = (value: any) => {
    if (value !== null) {
      setType(value);
    }
  };

  // Handle budget filter change
  const handleBudgetFilterChange = (index: number) => {
    const updatedBudgetFilter = [...budgetFilter];
    updatedBudgetFilter[index].enabled = !updatedBudgetFilter[index].enabled;
    setBudgetFilter(updatedBudgetFilter);
  };

  // Handle facilities filter change
  const handleFacilitiesFilterChange = (filterName: 'wifi' | 'parking' | 'airconditioning') => {
    setFacilitiesFilter({
      ...facilitiesFilter,
      [filterName]: !facilitiesFilter[filterName],
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Loader show={isLoading || isFetching || isLoadC || isFetchC || isFetchRT || isLoadRT} />
      <SearchBox
        location={location}
        setLocation={setLocation}
        checkIn={checkIn}
        checkOut={checkOut}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        onSearch={searchData}
        regionDropdownData={regionDropdownData}
        cityDropdownData={cityDropdownData}
        countryDropdownData={countryDropdownOptions!}
      />
      <div className="explore-wrap">
        <div className="filter-wrap">
          <div className="search-input-wrap">
            <h6>Search by residence name</h6>
            <div className="d-flex flex-row">
              <TextField
                type="text"
                className="w-100"
                size="medium"
                placeholder='e.g. "Villa Resort Plaza"'
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" className="pr-2" />
                    </InputAdornment>
                  ),
                }}
              />
              <div className="drawer-button-wrap">
                <Button variant="outline-dark" className="mx-3" title="Open filters" onClick={() => setOpenDrawer(true)}>
                  <FontAwesomeIcon icon={faFilter} />
                </Button>
              </div>
            </div>
          </div>
          <FilterBox
            budgetFilter={budgetFilter}
            reviewFilter={reviewFilter}
            setReviewFilter={setReviewFilter}
            facilitiesFilter={facilitiesFilter}
            handleBudgetFilterChange={handleBudgetFilterChange}
            handleFacilitiesFilterChange={handleFacilitiesFilterChange}
          />
        </div>

        <div className="content-wrap">
          <h4>{titleText}</h4>
          <ToggleButtonGroup
            color="primary"
            className="residence-types-group"
            value={type}
            exclusive
            onChange={(e, value) => handleTypeToggle(value)}
            aria-label="Residence type"
          >
            <ToggleButton value="all">All</ToggleButton>
            {residenceTypes?.data.map((rt: IResidenceType) => (
              <ToggleButton value={rt.id}>{rt.name}</ToggleButton>
            ))}
          </ToggleButtonGroup>
          <div className="d-flex flex-column gap-4">
            {residenceCardsData?.map((residence: IResidenceCardProps) => (
              <ResidenceCard {...residence} checkInDate={checkIn} checkOutDate={checkOut} />
            ))}
            {residenceCardsData.length === 0 && (
              <div className="text-center my-5 no-result-wrapper">
                <Image src={NoResultImage} className="img-fluid" />
                <h4>Oh dear! </h4>
                <h4>There are no residences matching your criteria...</h4>
              </div>
            )}
          </div>
        </div>
      </div>
      <React.Fragment key="kljuc">
        <SwipeableDrawer
          anchor="left"
          className="drawer-filter-box"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          onOpen={() => setOpenDrawer(true)}
        >
          <FilterBox
            budgetFilter={budgetFilter}
            reviewFilter={reviewFilter}
            setReviewFilter={setReviewFilter}
            facilitiesFilter={facilitiesFilter}
            handleBudgetFilterChange={handleBudgetFilterChange}
            handleFacilitiesFilterChange={handleFacilitiesFilterChange}
          />
        </SwipeableDrawer>
      </React.Fragment>
    </LocalizationProvider>
  );
};

export default Explore;
