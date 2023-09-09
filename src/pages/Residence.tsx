/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { useGetSingleAggregateResidenceQuery } from 'api/residence.api';
import axios from 'axios';
import AccommodationUnitCard from 'components/residence/accommodationUnit/AccommodationUnitCard';
import ResidenceOverview from 'components/ResidenceOverview';
import Animate from 'components/common/Animate';
import Carousel from 'components/common/Carousel';
import Loader from 'components/common/Loader';
import React, { useEffect, useState } from 'react';
import { Col, Row, Image } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import { IImageData } from 'types/IImageData';
import { decryptData } from 'utils/urlSafety';
import dayjs from 'dayjs';
import UnitsSearchBox from 'components/residence/accommodationUnit/UnitsSearchBox';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ICustomAccommodationUnitDTO } from 'types/accommodationUnit.types';
import getAvailableUnitsData from 'utils/search/getAvailableUnitsData';
import { Tab, Tabs } from '@mui/material';
import AccommodationUnitOverview from 'components/residence/accommodationUnit/AccommodationUnitOverview';
import ResidenceReview from 'components/ResidenceReview';
import NoResultImage from '../assets/img/illustrations/noResults.svg';

const Residence = () => {
  const { id: encryptedId } = useParams();
  const id = decodeURIComponent(decryptData(encryptedId!));
  const { data: residence, isLoading, isFetching, refetch } = useGetSingleAggregateResidenceQuery({ id });
  const [isFetchingImages, setIsFetchingImages] = useState<boolean>(false);
  const [residenceImageData, setResidenceImageData] = useState<IImageData[]>([]);
  const [unitImageData, setUnitImageData] = useState<IImageData[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const checkInDate = queryParams.get('checkIn') || dayjs().add(4, 'day').format('YYYY-MM-DD');
  const checkOutDate = queryParams.get('checkOut') || dayjs().add(11, 'day').format('YYYY-MM-DD');
  const [availableUnits, setAvailableUnits] = useState<ICustomAccommodationUnitDTO[]>([]);
  const [checkIn, setCheckIn] = useState<string>(checkInDate);
  const [checkOut, setCheckOut] = useState<string>(checkOutDate);
  const [currentTab, setCurrentTab] = useState('overview');
  const [currentAccUnit, setCurrentAccUnit] = useState<ICustomAccommodationUnitDTO | undefined>(undefined);

  /* Tab change handler */
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentAccUnit(undefined);
    setCurrentTab(newValue);
  };

  const handleReserveUnitClick = (accUnitId: string) => {
    setCurrentTab('accommodation_unit');
    const accUnit = residence?.data.units.find((acc) => acc.id === accUnitId);
    setCurrentAccUnit(accUnit);
  };

  const getAvailableUnits = () => {
    const units = getAvailableUnitsData(residence?.data!, checkIn, checkOut);
    setAvailableUnits(units);
  };

  const handleDateChange = (checkIn: string, checkOut: string) => {
    setCheckIn(checkIn);
    setCheckOut(checkOut);
  };

  useEffect(() => {
    if (!residence) return;
    getAvailableUnits();
  }, [residence, checkIn, checkOut]);

  useEffect(() => {
    async function getImages() {
      if (!residence?.data?.imageIds) return;
      setIsFetchingImages(true);
      try {
        const imageIds = currentAccUnit ? currentAccUnit?.imagesIds : residence?.data.imageIds;
        const imagePromises = imageIds!.map(async (imageId) => {
          const imageUrl = `http://192.168.1.11:8080/image/${imageId}`;
          const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

          // Convert the image data to a base64 URL
          const base64Image = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          const data: IImageData = { image: `data:image/png;base64,${base64Image}`, id: imageId };
          return data;
        });

        const newImageDataList = await Promise.all(imagePromises);
        if (currentAccUnit) {
          setUnitImageData(newImageDataList);
        } else {
          setResidenceImageData(newImageDataList);
        }

        setIsFetchingImages(false);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.log(error);
      }
    }
    getImages();
  }, [residence?.data.imageIds, currentAccUnit]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Loader show={isLoading || isFetching || isFetchingImages} />
      <div className="residence-page-wrap">
        <Animate>
          <Carousel images={currentAccUnit ? unitImageData : residenceImageData} />
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="secondary"
            variant="scrollable"
            indicatorColor="secondary"
            className="residence-tabs position-relative"
          >
            <Tab value="overview" label={`${residence?.data.name} - Overview`} />
            <Tab value="reviews" label="Reviews" />
            {currentAccUnit && <Tab value="accommodation_unit" label={currentAccUnit.name} />}
          </Tabs>
          {currentTab === 'overview' && <ResidenceOverview residence={residence?.data!} />}
          {currentTab === 'reviews' && <ResidenceReview residence={residence?.data} refetch={refetch} />}
          {currentTab === 'accommodation_unit' && (
            <AccommodationUnitOverview
              accommodationUnit={currentAccUnit}
              checkIn={checkIn}
              checkOut={checkOut}
              residence={residence?.data}
              image={unitImageData.length ? unitImageData[0].image : ''}
            />
          )}
          <div className="available-rooms-wrap">
            <h4>Available accommodation units</h4>
            <Row className="available-rooms-cards-wrap">
              <Col sm={12}>
                <UnitsSearchBox checkIn={checkIn} checkOut={checkOut} onDateChange={handleDateChange} />
              </Col>
              {availableUnits.map((unit) => (
                <Col md={6} lg={4} key={unit.id} className="card-wrap">
                  <AccommodationUnitCard
                    accommodationUnit={unit}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    handleClick={handleReserveUnitClick}
                  />
                </Col>
              ))}
            </Row>
            {availableUnits.length === 0 && (
              <div className="text-center my-5 no-result-wrapper m-auto">
                <h4>Oh dear! </h4>
                <h4>There are no accommodation units matching your criteria...</h4>
                <Image src={NoResultImage} className="img-fluid" />
              </div>
            )}
          </div>
        </Animate>
      </div>
    </LocalizationProvider>
  );
};

export default Residence;
