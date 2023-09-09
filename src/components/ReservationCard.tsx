/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IImageData } from 'types/IImageData';
import { Rating } from '@mui/material';
import { IReservation, IReservationGetDTO } from 'types/reservation.types';
import { useFindImagesQuery } from 'api/images.api';
import { useGetSingleAggregateResidenceQuery } from 'api/residence.api';
import generatePriceList, { PriceList } from 'utils/generatePriceList';
import dayjs from 'dayjs';
import { encryptData } from 'utils/urlSafety';
import routes from 'routes/routes';
import { Button } from 'react-bootstrap';
import { useUpdateReservationMutation } from 'api/reservation.api';
import { selectAuthentication } from 'app/store';
import { useSelector } from 'react-redux';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryDefinition } from '@reduxjs/toolkit/dist/query';
import IResponse from 'types/IResponse';
import Loader from './common/Loader';
import DeleteModalMessage from './common/DeleteModalMessage';
import InvoiceModal from './InvoiceModal';

export interface IReservationCardProps {
  reservation: IReservationGetDTO;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      {
        q: string;
      },
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      IResponse<IReservation[]>,
      'rootApi'
    >
  >;
}
/* 
   TODO: dodati za prosle rezervacija da se moze ocijeniti rezervacija
*/
const ReservationCard = ({ reservation, refetch }: IReservationCardProps) => {
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [totalPrice, setTotalPrice] = useState('');
  const [priceList, setPriceList] = useState<PriceList[]>([]);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [cancelModal, { isLoading: isLoadingPut }] = useUpdateReservationMutation();
  const { user: userAuth } = useSelector(selectAuthentication);

  const {
    data: imageIds,
    isLoading: isLoadingImageIds,
    isFetching: isFetchingImageIds,
  } = useFindImagesQuery({ q: `residence.id=${reservation.accommodationUnit.residence.id}` });
  const [imageData, setImageData] = React.useState<IImageData>({} as IImageData);
  const {
    data: residence,
    isLoading,
    isFetching,
  } = useGetSingleAggregateResidenceQuery({ id: reservation.accommodationUnit.residence.id });

  const isPast = dayjs().isAfter(dayjs(reservation.endAt));

  useEffect(() => {
    const accUnit = residence?.data.units.find((acc) => acc.id === reservation.accommodationUnit.id);
    if (accUnit === undefined) return;
    const generatedPriceList = generatePriceList(accUnit?.pricePeriods!, reservation.startAt, reservation.endAt);
    setPriceList(generatedPriceList);
    console.log(generatedPriceList);
    const price = generatedPriceList.reduce((acc, curr) => acc + curr.price, 0);
    setTotalPrice(`${generatedPriceList[0].currency} ${price}`);
  }, [residence]);

  useEffect(() => {
    async function getImages() {
      if (!imageIds) return;
      setIsFetchingImage(true);
      try {
        const imageUrl = `http://192.168.1.11:8080/image/${imageIds.data[0]}`;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Convert the image data to a base64 URL
        const base64Image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        const data: IImageData = { image: `data:image/png;base64,${base64Image}`, id: imageIds.data[0] };
        setImageData(data);
        setIsFetchingImage(false);
      } catch (error) {
        console.log(error);
      }
    }
    getImages();
  }, [imageIds]);

  async function cancelReservation() {
    const { accommodationUnit, user, cancelled, ...rest } = reservation;
    await cancelModal({ ...rest, cancelled: true, userEmail: userAuth!.email, accommodationUnitId: accommodationUnit.id })
      .unwrap()
      .then((dataUpdate) => {
        const message = `[${dataUpdate.status}] Updated row with ID: ${dataUpdate.data.id}`;
        refetch();
        setShowCancelModal(false);
      })
      .catch((err) => {
        console.log(err.data.message);
      });
  }

  return (
    <>
      <Loader show={isFetchingImage || isLoadingImageIds || isFetchingImageIds || isLoading || isFetching} />
      <div className="reservation-container">
        <div className="reservation-image-container">
          <picture>
            <source media="(min-width: 992px)" srcSet={imageData.image} />
            <img src={imageData.image} alt="Out door house" />
          </picture>
        </div>
        <div className="reservation-content-container">
          <div className="reservation-info-container">
            <h3 className="reservation-name">{residence?.data.name}</h3>
            <span className="reviews">{reservation.accommodationUnit.name}</span>
            <div className="reservation-ratings">
              <Rating name="read-only" value={4.5} readOnly precision={0.5} size="small" />
              <span className="average-review">{4.5}</span>
            </div>
            <h4 className="reservation-type">Created at: {dayjs(reservation.createdAt).format('DD.MM.YYYY HH:mm:ss')}</h4>
            <h4 className="reservation-type">{priceList.length} night stays</h4>
            <Button
              variant="warning"
              className="px-4"
              href={`${routes.Residence.absolutePath.replace(
                ':id',
                encodeURIComponent(encryptData(reservation.accommodationUnit.residence.id))
              )}`}
            >
              View Residence
            </Button>
          </div>
          <div className="reservation-price-container">
            <p className="reservation-units-count">Check in: {dayjs(reservation.startAt).format('DD.MM.YYYY')}</p>
            <p className="reservation-units-count">Check out: {dayjs(reservation.endAt).format('DD.MM.YYYY')}</p>
            <p className="reservation-price">{totalPrice}</p>
            <b>
              {isPast ? (
                <p className="reservation-taxes text-success">Finished</p>
              ) : (
                <p className="reservation-taxes text-primary">{reservation.cancelled ? 'Cancelled' : 'Not Cancelled'}</p>
              )}
            </b>
            <div className="d-flex gap-2 flex-column flex-md-row">
              {!reservation.cancelled && !isPast && (
                <Button variant="danger" className="px-4" onClick={() => setShowCancelModal(true)}>
                  Cancel
                </Button>
              )}
              <Button variant="primary" className="px-4" onClick={() => setShowInvoiceModal(true)}>
                Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DeleteModalMessage
        showModal={showCancelModal}
        id={reservation.id.toString()}
        resetState={() => setShowCancelModal(false)}
        doAction={cancelReservation}
        headerMsg="Cancel Reservation"
        bodyMsg="Are you sure you want to cancel this reservation?"
        buttonText="Cancel"
      />
      <InvoiceModal
        checkIn={reservation.startAt}
        checkOut={reservation.endAt}
        generatedPriceList={priceList}
        totalPrice={totalPrice}
        currency={priceList[0]?.currency}
        showModal={showInvoiceModal}
        hideModal={setShowInvoiceModal}
        residence={residence?.data!}
      />
    </>
  );
};

export default ReservationCard;
