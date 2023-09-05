/* eslint-disable no-shadow */
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DatePicker } from '@mui/x-date-pickers';
import Dropdown from 'components/common/Dropdown';
import dayjs from 'dayjs';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { IDropdown } from 'types/IDropdown.types';

export interface ISearchBoxProps {
  location: {
    country: string;
    region: string;
    city: string;
  };
  setLocation: React.Dispatch<
    React.SetStateAction<{
      country: string;
      region: string;
      city: string;
    }>
  >;
  checkIn: string;
  setCheckIn: React.Dispatch<React.SetStateAction<string>>;
  checkOut: string;
  setCheckOut: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
  regionDropdownData: IDropdown[];
  cityDropdownData: IDropdown[];
  countryDropdownData: IDropdown[];
}

const SearchBox = ({
  location,
  setLocation,
  checkIn,
  setCheckIn,
  setCheckOut,
  checkOut,
  onSearch,
  regionDropdownData,
  cityDropdownData,
  countryDropdownData,
}: ISearchBoxProps) => {
  const clearLocationFilters = () => {
    setLocation({ country: '', region: '', city: '' });
  };

  const disableDaysBeforeCheckIn = (date: dayjs.Dayjs) => {
    const checkInDate = dayjs(checkIn);
    return date.isBefore(checkInDate.startOf('day') || date.isSame(checkInDate.startOf('day')));
  };

  return (
    <div className="mt-3 residence-search-outer-wrap d-flex flex-column">
      <div className="search-title">Find Your Ideal Stay</div>
      {(location.country || location.region || location.city) && (
        <div className="clear-filters">
          <Button variant="warning" className="mx-3 rounded-5" onClick={clearLocationFilters} title="Clear location filters">
            <FontAwesomeIcon icon={faFilterCircleXmark} />
          </Button>
        </div>
      )}
      <Row className="residence-search-inner-wrap">
        <Col>
          <Dropdown
            value={location.country}
            size="medium"
            setValue={(e) => setLocation({ ...location, country: e })}
            label="Country"
            options={countryDropdownData}
          />
        </Col>
        <Col>
          <Dropdown
            size="medium"
            value={location.region}
            setValue={(e) => setLocation({ ...location, region: e })}
            label="Region"
            options={regionDropdownData}
            disabled={regionDropdownData.length === 0}
          />
        </Col>
        <Col>
          <Dropdown
            size="medium"
            value={location.city}
            setValue={(e) => setLocation({ ...location, city: e })}
            label="City"
            options={cityDropdownData}
            disabled={cityDropdownData.length === 0}
          />
        </Col>
        <Col>
          <DatePicker
            label="Check-in"
            className="w-100"
            disableHighlightToday
            disablePast
            value={dayjs(checkIn)}
            onChange={(e) => setCheckIn(dayjs(e!).format('YYYY-MM-DD'))}
          />
        </Col>
        <Col>
          <DatePicker
            label="Check-out"
            className="w-100"
            shouldDisableDate={disableDaysBeforeCheckIn}
            disableHighlightToday
            disablePast
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
  );
};

export default SearchBox;
