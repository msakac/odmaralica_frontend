/* eslint-disable no-shadow */
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

export interface ISearchBoxProps {
  checkIn: string;
  setCheckIn: React.Dispatch<React.SetStateAction<string>>;
  checkOut: string;
  setCheckOut: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

const UnitsSearchBox = ({ checkIn, setCheckIn, setCheckOut, checkOut, onSearch }: ISearchBoxProps) => {
  const disableDaysBeforeCheckIn = (date: dayjs.Dayjs) => {
    const checkInDate = dayjs(checkIn);
    return date.isBefore(checkInDate.startOf('day'));
  };

  return (
    <div className="mt-3 units-search-outer-wrap d-flex flex-column">
      <Row className="units-search-inner-wrap">
        <Col sm={12} md={4}>
          <DatePicker
            label="Check-in"
            className="w-100"
            disableHighlightToday
            disablePast
            value={dayjs(checkIn)}
            onChange={(e) => setCheckIn(dayjs(e!).format('YYYY-MM-DD'))}
          />
        </Col>
        <Col sm={12} md={4}>
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
        <Col sm={12} md={4}>
          <Button variant="primary" type="submit" className="w-100 search-button" onClick={onSearch}>
            Check Availability
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default UnitsSearchBox;
