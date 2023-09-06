/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button, Modal, Image, Row, Col } from 'react-bootstrap';

import { ICustomAccommodationUnitDTO } from 'types/accommodationUnit.types';
import { IResidenceAggregateDTO } from 'types/residence.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneArrival, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import { PriceList } from 'utils/generatePriceList';
import dayjs from 'dayjs';
import Input from './common/Input';

interface IInvoiceModalProps {
  checkIn: string;
  checkOut: string;
  generatedPriceList: PriceList[];
  totalPrice: string;
  currency: string;
  showModal: boolean;
  hideModal: (a: boolean) => void;
  residence: IResidenceAggregateDTO | undefined;
}

const InvoiceModal = ({
  checkIn,
  checkOut,
  generatedPriceList,
  totalPrice,
  currency,
  showModal,
  hideModal,
  residence,
}: IInvoiceModalProps) => {
  const [note, setNote] = useState<string>('');
  const address = `${residence?.address.street}, ${residence?.address.city.name} ${residence?.address.city.zip}, ${residence?.address.city.region.country.name}`;

  return (
    <Modal show={showModal} onHide={() => hideModal(false)} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Reservation Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <div className="overview-aside">
          <div className="asside-owner">
            <h2>Residence</h2>
            <div className="mb-4">
              <b>{residence?.name}</b> - {address}
            </div>
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
            <h2>Price Per Night</h2>
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
                <h6>{totalPrice}</h6>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Row className="w-100 gap-3 gap-lg-0">
          <Col sm={12}>
            <Button variant="danger" className="w-100" onClick={() => hideModal(false)}>
              Close
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
