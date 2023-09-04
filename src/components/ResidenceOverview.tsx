/* eslint-disable no-unused-vars */
import React from 'react';
import { IUserGetDTO } from 'types/users.types';
// import { Rating } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Za ikonice isto fontawesome koristis

export interface IResidenceOverviewProps {
  name: string;
  avgReview?: number; // ovu vrednost koristis za <Rating> komponentu, imas primjer v ResidenceCard
  reviewsCount?: number;
  address: string;
  description: string;
  owner: IUserGetDTO;

  isParkingFree: boolean;
  isWifiFree: boolean;
  isAirConFree: boolean;

  distanceSea: string;
  distanceStore: string;
  distanceBeach: string;
  distanceCenter: string;
}

const getFacility = (value: boolean) => {
  return value ? 'Yes' : 'No';
};

const ResidenceOverview = ({
  name = 'Lakeside Motel Warefront',
  avgReview = 4.5,
  reviewsCount = 1200,
  address = 'Lorem ipsun road, Tantruim-2322, Melbourne, Australica',
  description = 'Bla bla bla',
  owner = {
    name: 'Sam',
    surname: 'Sepiol',
    email: 'azroditus@gmail.com',
    description: 'Bla bla bla',
    phoneNumber: '0994019312',
  },
  isParkingFree = true,
  isWifiFree = true,
  isAirConFree = false,
  distanceSea = '500',
  distanceStore = '1500',
  distanceBeach = '800',
  distanceCenter = '2000',
}: IResidenceOverviewProps) => {
  return <div>Blabla</div>;
};

export default ResidenceOverview;
