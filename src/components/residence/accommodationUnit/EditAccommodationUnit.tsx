/* eslint-disable no-unused-vars */
import React, { RefObject, useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Loader from 'components/common/Loader';
import ActionMessages, { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import { Tab, Tabs } from '@mui/material';
import { useFindImagesQuery } from 'api/images.api';
import axios from 'axios';
import { useSearhText } from 'components/layout/SidebarLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { IAccommodationUnitGetDTO, IAccommodationUnitOmited } from 'types/accommodationUnit.types';
import { useUpdateAccommodationUnitMutation } from 'api/accommodationUnit.api';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryDefinition } from '@reduxjs/toolkit/dist/query';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import IResponse from 'types/IResponse';
import TabEditImages from 'components/residence/TabEditImages';
import { IImageData } from 'types/IImageData';
import AccommodationUnitForm from './AccommodationUnitForm';
import PricePeriod from './PricePeriod';

interface IEditAccommodationUnitProps {
  object: IAccommodationUnitGetDTO;
  actionMessagesRef: RefObject<ActionMessagesRef>;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      {
        q: string;
      },
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      IResponse<IAccommodationUnitGetDTO[]>,
      'rootApi'
    >
  >;
}

const EditAccommodationUnit = ({ object, actionMessagesRef, refetch }: IEditAccommodationUnitProps) => {
  /* States and data */
  const [imageData, setImageData] = useState<IImageData[]>([]);
  const [currentTab, setCurrentTab] = useState('acc_unit_details');
  const [isFetchingImages, setIsFetchingImages] = useState<boolean>(false);
  const {
    data: imageIds,
    isLoading: isLoadingImageIds,
    isFetching: isFetchingImageIds,
    refetch: refetchImages,
  } = useFindImagesQuery({ q: `accommodationUnit.id=${object.id}` });
  const { residence, ...restOfData } = object;
  const [accUnitData, setAccUnitData] = useState<IAccommodationUnitOmited>({ ...restOfData });
  /* Outlet context for searching */
  const { searchText } = useSearhText();
  /* Get user */
  const [updateAccommodationUnit] = useUpdateAccommodationUnitMutation();

  /* Use Effect to fetch images when imageIds are changes */
  useEffect(() => {
    async function getImages() {
      if (!imageIds || imageIds.data.length === 0) return;
      setIsFetchingImages(true);
      try {
        const imagePromises = imageIds!.data.map(async (imageId) => {
          const imageUrl = `http://localhost:8080/image/${imageId}`;
          const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

          // Convert the image data to a base64 URL
          const base64Image = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          const data: IImageData = { image: `data:image/png;base64,${base64Image}`, id: imageId };
          return data;
        });

        const newImageDataList = await Promise.all(imagePromises);
        setImageData(newImageDataList);
        setIsFetchingImages(false);
      } catch (error) {
        actionMessagesRef.current!.createMessage('Error fetching images', MessageType.Error);
      }
    }
    getImages();
  }, [imageIds]);

  /* Update residence api handler */
  async function onSubmitUpdateAccommodationUnit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateAccommodationUnit({ ...accUnitData, id: object.id, residenceId: object.residence.id })
      .unwrap()
      .then((dataUpdate) => {
        const message = `[${dataUpdate.status}] Updated Accommodation Unit: ${dataUpdate.data.name}`;
        actionMessagesRef.current!.createMessage(message, MessageType.Ok);
        refetch();
      })
      .catch((err) => {
        actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  /* Tab change handler */
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Loader show={isFetchingImageIds || isLoadingImageIds || isFetchingImages} />
      <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form h-100">
        <Card.Body>
          <h6 className="my-3">
            Accommodation Unit <FontAwesomeIcon icon={faArrowRight} size="sm" /> {accUnitData!.name}
          </h6>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="secondary"
            variant="scrollable"
            indicatorColor="secondary"
            className="acc-unit-tabs"
          >
            <Tab value="acc_unit_details" label="Accom Unit Details" />
            <Tab value="acc_unit_images" label="Accom Unit Galery" />
            <Tab value="acc_unit_price_period" label="Price Periods" />
            <Tab value="acc_unit_reservations" label="Reservations" />
          </Tabs>
          <Row className="crud-wrap flex-column gap-2 mt-4">
            <hr className="m-0" />
            <Row className="edit-residence-wrap flex-column gap-4 align-items-start">
              {currentTab === 'acc_unit_details' && (
                <AccommodationUnitForm
                  buttonText="Update"
                  data={accUnitData}
                  setData={setAccUnitData}
                  onSubmit={onSubmitUpdateAccommodationUnit}
                  fullWidth
                />
              )}
              {currentTab === 'acc_unit_images' && (
                <TabEditImages
                  foreignKeyId={object.id}
                  actionMessageRef={actionMessagesRef}
                  imageData={imageData}
                  refetch={refetchImages}
                  imageForeignKey="accommodationUnitId"
                />
              )}
              {/** accUnitId, actionMessageRef */}
              {currentTab === 'acc_unit_price_period' && (
                <PricePeriod accUnitId={object.id} actionMessageRef={actionMessagesRef} />
              )}
              {currentTab === 'acc_unit_reservations' && <div>Reservations</div>}
            </Row>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};
export default EditAccommodationUnit;
