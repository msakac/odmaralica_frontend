/* eslint-disable no-console */
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser, faBed, faMoon, faCoins } from '@fortawesome/free-solid-svg-icons';
import { ICustomAccommodationUnitDTO } from 'types/accommodationUnit.types';
import { IImageData } from 'types/IImageData';
import axios from 'axios';
import generatePriceList, { PriceList } from 'utils/generatePriceList';
import Loader from '../../common/Loader';

type Props = {
  accommodationUnit: ICustomAccommodationUnitDTO;
  checkIn: string;
  checkOut: string;
};

const AccommodationUnitCard = ({ accommodationUnit, checkIn, checkOut }: Props) => {
  const [isFetchingImage, setIsFetchingImage] = React.useState(false);
  const [imageData, setImageData] = React.useState<IImageData>({} as IImageData);
  const [priceList, setPriceList] = React.useState<PriceList[]>([]);

  useEffect(() => {
    const generaterPriceList = generatePriceList(accommodationUnit.pricePeriods, checkIn, checkOut);
    setPriceList(generaterPriceList);
    // console.log(priceList);
  }, [checkIn, checkOut]);

  useEffect(() => {
    async function getImages() {
      const imageId = accommodationUnit.imagesIds[0];
      if (!imageId) return;
      setIsFetchingImage(true);
      try {
        const imageUrl = `http://localhost:8080/image/${imageId}`;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Convert the image data to a base64 URL
        const base64Image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        const data: IImageData = { image: `data:image/png;base64,${base64Image}`, id: imageId };
        setImageData(data);
        setIsFetchingImage(false);
      } catch (error) {
        console.log(error);
      }
    }
    getImages();
  }, [accommodationUnit.imagesIds[0]]);

  return (
    <>
      <Loader show={isFetchingImage} />
      <div className="accommodation-unit-card-container">
        <div className="accommodation-unit-card-image-container">
          <picture>
            <img src={imageData.image} alt="Out door house" />
          </picture>
        </div>
        <div className="accommodation-unit-card-content-container">
          <h3 className="accommodation-unit-card-name">{accommodationUnit.name}</h3>
          <div className="icon-container">
            <FontAwesomeIcon icon={faHouse} size="sm" />
            <p>
              {accommodationUnit.unitSize} m<sup>2</sup>
            </p>
          </div>
          <div className="icon-container">
            <FontAwesomeIcon icon={faUser} size="sm" />
            <p>{accommodationUnit.numOfGuests} guests</p>
          </div>
          <div className="icon-container">
            <FontAwesomeIcon icon={faBed} size="sm" />
            <p>{accommodationUnit.beds}</p>
          </div>
          <div className="reservation-info">
            <div className="reservation-info-stays">
              <FontAwesomeIcon icon={faMoon} size="lg" />
              <h6>
                {priceList.length} {`${priceList.length === 1 ? 'night' : 'nights'}`}
              </h6>
            </div>
            <div className="reservation-info-price">
              <FontAwesomeIcon icon={faCoins} size="lg" />
              <h6>
                {priceList.length ? priceList[0].currency : 'Render'}{' '}
                {priceList.reduce((total, item) => total + item.price, 0)}
              </h6>
            </div>
          </div>
          <a className="btn btn-primary accommodation-btn" href="www.google.com" aria-label="See availability">
            Reserve suite
          </a>
        </div>
      </div>
    </>
  );
};

export default AccommodationUnitCard;
