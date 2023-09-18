/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Modal, Image, Row, Col } from 'react-bootstrap';

import { ICustomAccommodationUnitDTO } from 'types/accommodationUnit.types';
import { IResidenceAggregateDTO } from 'types/residence.types';
import { useFindPrivacyRequestsQuery } from 'api/privacyRequest.api';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'app/store';
import { useNavigate } from 'react-router-dom';
import routes from 'routes/routes';
import Input from './common/Input';
import Loader from './common/Loader';

interface IConfirmReservationModalProps {
  showModal: boolean;
  hideModal: (a: boolean) => void;
  doAction: (note: string) => void;
  checkIn: string;
  checkOut: string;
  totalPrice: string;
  accommodationUnit: ICustomAccommodationUnitDTO;
  residence: IResidenceAggregateDTO;
  image: string;
}

const ConfirmReservationModal = ({
  showModal,
  hideModal,
  doAction,
  checkIn,
  checkOut,
  totalPrice,
  residence,
  accommodationUnit,
  image,
}: IConfirmReservationModalProps) => {
  const [note, setNote] = useState<string>('');
  const { user } = useSelector(selectAuthentication);
  const [dataDeletionExist, setDataDeletionExist] = useState<boolean>(false);
  const {
    data: privacyRequestData,
    isLoading: isLoadingPrivacyRequest,
    isFetching: isFetchingPrivacyRequest,
  } = useFindPrivacyRequestsQuery({ q: `user.id=${user!.id}` });
  const navigate = useNavigate();

  useEffect(() => {
    // map through privacy requests and check if any of them is not revoked
    const notRevoked = privacyRequestData?.data.filter((request) => !request.revoked);
    if (notRevoked && notRevoked.length > 0) {
      setDataDeletionExist(true);
    } else {
      setDataDeletionExist(false);
    }
  }, [privacyRequestData]);

  const address = `${residence?.address.street}, ${residence?.address.city.name} ${residence?.address.city.zip}, ${residence?.address.city.region.country.name}`;

  const handleOnCompleteReservation = () => {
    if (dataDeletionExist) {
      hideModal(false);
      navigate(routes.Profile.absolutePath, { state: { dataDeletionNotice: true } });
      return;
    }
    doAction(note);
  };

  return (
    <Modal show={showModal} onHide={() => hideModal(false)} animation={false}>
      <Loader show={isLoadingPrivacyRequest || isFetchingPrivacyRequest} />
      <Modal.Header closeButton>
        <Modal.Title>Confirm Reservation</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Image src={image} className="img-fluid object-fit-cover modal-image" />
        <div className="residence-info mb-4 text-center ">
          <div className="mb-4">
            <b>{residence.name}</b> - {address}
          </div>
          <hr />
          <div>
            <h6>Accommodation Unit: {accommodationUnit.name}</h6>
            <div className="justify-content-center my-4">
              <p>
                Check In: <span className="dates">{checkIn}</span>
              </p>
              <p>
                Check Out: <span className="dates">{checkOut}</span>
              </p>
            </div>
            <h5>Total Price: {totalPrice}</h5>
          </div>
        </div>
        <Input label="Note for host" value={note} setValue={setNote} type="multiline" help="Note or proposition for host" />
      </Modal.Body>

      <Modal.Footer>
        <Row className="w-100 gap-3 gap-lg-0">
          <Col sm={6}>
            <Button variant="danger" className="w-100" onClick={() => hideModal(false)}>
              Close
            </Button>
          </Col>
          <Col sm={6}>
            <Button variant="primary" className="w-100" onClick={handleOnCompleteReservation}>
              Complete Reservation
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmReservationModal;
