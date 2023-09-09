/* eslint-disable no-console */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSink,
  faToiletPaper,
  faMountainSun,
  faTv,
  faDog,
  faSmoking,
  faWater,
  faSquare,
  faUsers,
  faBed,
  faPlaneArrival,
  faPlaneDeparture,
} from '@fortawesome/free-solid-svg-icons';
import { ICustomAccommodationUnitDTO } from 'types/accommodationUnit.types';
import { Button, Col, Row } from 'react-bootstrap';
import generatePriceList from 'utils/generatePriceList';
import dayjs from 'dayjs';
import { IResidenceAggregateDTO } from 'types/residence.types';
import ConfirmReservationModal from 'components/ConfirmReservationModal';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'app/store';
import routes from 'routes/routes';
import { useNavigate } from 'react-router-dom';
import { useCreateReservationMutation } from 'api/reservation.api';
import Loader from 'components/common/Loader';

type IAccommodationUnitOverviewProps = {
  accommodationUnit: ICustomAccommodationUnitDTO | undefined;
  checkIn: string;
  checkOut: string;
  residence: IResidenceAggregateDTO | undefined;
  image: string;
};
const AccommodationUnitOverview = ({
  accommodationUnit,
  checkIn,
  checkOut,
  residence,
  image,
}: IAccommodationUnitOverviewProps) => {
  const generatedPriceList = generatePriceList(accommodationUnit!.pricePeriods, checkIn, checkOut);
  const totalPrice = generatedPriceList.reduce((acc, curr) => acc + curr.price, 0);
  const [showModal, setShowModal] = React.useState(false);
  const { currency } = generatedPriceList[0];
  const { user } = useSelector(selectAuthentication);
  const [createReservation, { isLoading: isLoadingReservationPost }] = useCreateReservationMutation();
  const navigate = useNavigate();

  const handleOnCompleteReservation = () => {
    if (!user) {
      navigate(routes.Login.absolutePath);
    } else if (user?.policyAccepted) {
      setShowModal(true);
    } else {
      navigate(routes.PrivacyPolicy.absolutePath, { state: { privacyPolicyNotice: true } });
    }
  };

  async function addReservation(note: string) {
    await createReservation({
      userId: user!.id,
      accommodationUnitId: accommodationUnit!.id,
      note,
      isCancelled: false,
      startAt: checkIn,
      endAt: checkOut,
    })
      .unwrap()
      .then((reservation) => {
        const reservationId = reservation.data.id;
        navigate(routes.MyReservations.absolutePath, { state: { reservationId } });
      })
      .catch((error) => {
        console.error('Error creating residence:', error);
      });
  }
  return (
    <>
      <Loader show={isLoadingReservationPost} />
      <div className="unit-overview">
        <div className="overview-content">
          <div className="content-heading">
            <h1>{accommodationUnit?.name}</h1>
            <Row className="content-heading-description">
              <Col sm={12} md={4} className="attribute">
                <h6>Unit size</h6>
                <div className="facility">
                  <FontAwesomeIcon icon={faSquare} className="font-icon-orange" size="sm" />
                  <p>
                    {accommodationUnit?.unitSize} m<sup>2</sup>
                  </p>
                </div>
              </Col>
              <Col sm={12} md={4} className="attribute">
                <h6>Guests</h6>
                <div className="facility">
                  <FontAwesomeIcon icon={faUsers} className="font-icon-orange" size="sm" />
                  <p>{accommodationUnit?.numOfGuests}</p>
                </div>
              </Col>
              <Col sm={12} md={4} className="attribute">
                <h6>Beds</h6>
                <div className="facility">
                  <FontAwesomeIcon icon={faBed} className="font-icon-orange" size="sm" />
                  <p>{accommodationUnit?.beds}</p>
                </div>
              </Col>
            </Row>
          </div>
          <div className="content-description">
            <div className="content-description-text">
              <h2>Description</h2>
              <p>{accommodationUnit?.description}</p>
            </div>
            <hr />
            <div className="content-description-facilities">
              <h2>Unit facilities</h2>
              <Row>
                <Col sm={12} md={6}>
                  <div className="facility">
                    <FontAwesomeIcon icon={faSink} className="font-icon" size="sm" />
                    <p>Private Kitchen: {accommodationUnit?.privateKitchen ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="facility">
                    <FontAwesomeIcon icon={faToiletPaper} className="font-icon" size="sm" />
                    <p>Private Bathroom: {accommodationUnit?.privateBathroom ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="facility">
                    <FontAwesomeIcon icon={faMountainSun} className="font-icon" size="sm" />
                    <p>Terrace: {accommodationUnit?.terrace ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="facility">
                    <FontAwesomeIcon icon={faWater} className="font-icon" size="sm" />
                    <p>Sea View: {accommodationUnit?.seaView ? 'Yes' : 'No'}</p>
                  </div>
                </Col>
                <Col sm={12} md={6}>
                  <div className="facility">
                    <FontAwesomeIcon icon={faTv} className="font-icon" size="sm" />
                    <p>TV: {accommodationUnit?.tv ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="facility">
                    <FontAwesomeIcon icon={faDog} className="font-icon" size="sm" />
                    <p>Pets: {accommodationUnit?.pets ? 'Allowed' : 'Not Allowed'}</p>
                  </div>
                  <div className="facility">
                    <FontAwesomeIcon icon={faSmoking} className="font-icon" size="sm" />
                    <p>Smoking: {accommodationUnit?.smoking ? 'Allowed' : 'Not Allowed'}</p>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="overview-aside">
          <div className="asside-owner">
            <h2>Reservation</h2>
            <div className="asside-owner-item">
              <FontAwesomeIcon icon={faPlaneArrival} className="font-icon" size="sm" />
              <p>
                <b>Check-In:</b> {dayjs(checkIn).format('DD.MM.YYYY')}
              </p>
            </div>
            <div className="asside-owner-item">
              <FontAwesomeIcon icon={faPlaneDeparture} className="font-icon" size="sm" />
              <p>
                <b>Check-Out:</b> {dayjs(checkOut).format('DD.MM.YYYY')}
              </p>
            </div>
          </div>
          <hr />
          <div className="aside-explore">
            <h2>Price Details</h2>
            {generatedPriceList.map((price) => (
              <div className="explore-item">
                <div className="explore-item-content">
                  {dayjs(price.date).format('DD.MM.YYYY')}
                  <p>
                    {currency} {price.price}
                  </p>
                </div>
              </div>
            ))}
            <div className="explore-item">
              <div className="explore-item-content total">
                <h6>Total:</h6>
                <h6>
                  {currency} {totalPrice}
                </h6>
              </div>
            </div>
          </div>
          <Button
            className="btn btn-primary complete-btn w-100"
            onClick={handleOnCompleteReservation}
            aria-label="Complete Reservation"
          >
            Complete reservation
          </Button>
        </div>
      </div>
      <ConfirmReservationModal
        showModal={showModal}
        hideModal={setShowModal}
        checkIn={checkIn}
        checkOut={checkOut}
        totalPrice={`${currency} ${totalPrice}`}
        residence={residence!}
        accommodationUnit={accommodationUnit!}
        doAction={addReservation}
        image={image}
      />
    </>
  );
};

export default AccommodationUnitOverview;
