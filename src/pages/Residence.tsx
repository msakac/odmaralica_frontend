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
import { Col, Row } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import { IImageData } from 'types/IImageData';
import { decryptData } from 'utils/urlSafety';
import dayjs from 'dayjs';
import UnitsSearchBox from 'components/residence/accommodationUnit/UnitsSearchBox';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Residence = () => {
  // Residence id in URL
  const { id: encryptedId } = useParams();
  const id = decodeURIComponent(decryptData(encryptedId!));
  const { data: residence, isLoading, isFetching } = useGetSingleAggregateResidenceQuery({ id });
  const [isFetchingImages, setIsFetchingImages] = useState<boolean>(false);
  const [imageData, setImageData] = useState<IImageData[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const checkInDate = queryParams.get('checkIn') || dayjs().add(4, 'day').format('YYYY-MM-DD');
  const checkOutDate = queryParams.get('checkOut') || dayjs().add(11, 'day').format('YYYY-MM-DD');
  const [checkIn, setCheckIn] = useState<string>(checkInDate);
  const [checkOut, setCheckOut] = useState<string>(checkOutDate);
  useEffect(() => {
    async function getImages() {
      setIsFetchingImages(true);
      try {
        const imageIds = residence?.data.imageIds;
        const imagePromises = imageIds!.map(async (imageId) => {
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
        console.log(error);
      }
    }
    getImages();
  }, [residence?.data.imageIds]);

  const onSearch = () => {
    console.log('search');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Loader show={isLoading || isFetching || isFetchingImages} />
      <div className="residence-page-wrap">
        <Animate>
          <Carousel images={imageData} />

          <ResidenceOverview residence={residence?.data!} />
          <div className="available-rooms-wrap">
            <h4>Available rooms</h4>
            <Row className="available-rooms-cards-wrap">
              <Col sm={12}>
                <UnitsSearchBox
                  checkIn={checkIn}
                  checkOut={checkOut}
                  setCheckIn={setCheckIn}
                  setCheckOut={setCheckOut}
                  onSearch={onSearch}
                />
              </Col>
              {residence?.data.units.map((unit) => (
                <Col sm={6} md={4} key={unit.id} className="card-wrap">
                  <AccommodationUnitCard accommodationUnit={unit} />
                </Col>
              ))}
            </Row>
          </div>
        </Animate>
      </div>
    </LocalizationProvider>
  );
};

export default Residence;
