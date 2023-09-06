/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

export interface ISearchBoxProps {
  checkIn: string;
  checkOut: string;
  onDateChange: (checkIn: string, checkOut: string) => void;
}

const UnitsSearchBox = ({ checkIn, checkOut, onDateChange }: ISearchBoxProps) => {
  const disableDaysBeforeCheckIn = (date: dayjs.Dayjs) => {
    const checkInDate = dayjs(checkIn);
    return date.isBefore(checkInDate.startOf('day')) || date.isSame(checkInDate.startOf('day'));
  };

  return (
    <div className="mt-3 units-search-outer-wrap d-flex flex-column">
      <Row className="units-search-inner-wrap">
        <Col md={6}>
          <DatePicker
            label="Check-in"
            className="w-100"
            disableHighlightToday
            disablePast
            value={dayjs(checkIn)}
            onChange={(e) => onDateChange(dayjs(e!).format('YYYY-MM-DD'), checkOut)}
          />
        </Col>
        <Col md={6}>
          <DatePicker
            label="Check-out"
            className="w-100"
            shouldDisableDate={disableDaysBeforeCheckIn}
            disableHighlightToday
            disablePast
            value={dayjs(checkOut)}
            onChange={(e) => onDateChange(checkIn, dayjs(e!).format('YYYY-MM-DD'))}
          />
        </Col>
      </Row>
    </div>
  );
};

export default UnitsSearchBox;
