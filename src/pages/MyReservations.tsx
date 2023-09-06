/* eslint-disable no-console */
import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'app/store';
import { useFindReservationsQuery } from 'api/reservation.api';
import Loader from 'components/common/Loader';
import { IReservationGetDTO } from 'types/reservation.types';
import ReservationCard from 'components/ReservationCard';
import { Image } from 'react-bootstrap';
import NoResultImage from '../assets/img/illustrations/noResults.svg';

const MyReservations = () => {
  const { user } = useSelector(selectAuthentication);
  const { data: reservations, isLoading, isFetching, refetch } = useFindReservationsQuery({ q: `user.id=${user!.id}` });
  return (
    <>
      <Loader show={isLoading || isFetching} />
      <div className="reservation-wrapper">
        <h4 className="my-4">My trips</h4>
        <div className="reservations-list w-100 d-flex flex-column gap-3">
          {reservations?.data.map((reservation: IReservationGetDTO) => (
            <ReservationCard key={reservation.id} reservation={reservation} refetch={refetch} />
          ))}
          {reservations?.data.length === 0 && (
            <div className="text-center my-5 no-result-wrapper m-auto">
              <h4>Oh dear! </h4>
              <h4>You have still not made a reservation...</h4>
              <Image src={NoResultImage} className="img-fluid" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyReservations;
