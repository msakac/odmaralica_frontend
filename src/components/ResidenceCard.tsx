/* eslint-disable no-console */
import axios from 'axios';
import React, { useEffect } from 'react';
import { IImageData } from 'types/IImageData';
import { Rating } from '@mui/material';
import Loader from './common/Loader';

export interface IResidenceCardProps {
  id?: string;
  name?: string;
  residenceType?: string;
  description?: string;
  unitsCount?: string;
  price?: string;
  reviewsCount?: number;
  avgReview?: number;
  imageId?: string;
}

const ResidenceCard = ({
  id = 'residence',
  name = 'Julia Dens Resort',
  residenceType = 'Live a little and celebrate with champagne',
  description = 'Reats include a glass of French champagne, parking and a late checkout. Gym included. Flexible cancellation applies',
  unitsCount = '1 room 2 days',
  price = '$240',
  reviewsCount = 1200,
  avgReview = 4.5,
  imageId,
}: IResidenceCardProps) => {
  const [isFetchingImage, setIsFetchingImage] = React.useState(false);
  const [imageData, setImageData] = React.useState<IImageData>({} as IImageData);

  useEffect(() => {
    async function getImages() {
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
  }, []);
  return (
    <>
      <Loader show={isFetchingImage} />
      <div className="residence-container" id={id}>
        <div className="residence-image-container">
          <picture>
            <source media="(min-width: 992px)" srcSet={imageData.image} />
            <img src={imageData.image} alt="Out door house" />
          </picture>
        </div>
        <div className="residence-content-container">
          <div className="residence-info-container">
            <h3 className="residence-name">{name}</h3>
            <div className="residence-ratings">
              <Rating name="read-only" value={avgReview} readOnly precision={0.5} size="small" />
              <span className="average-review">{avgReview}</span>
              <span className="reviews">({reviewsCount}) Reviews</span>
            </div>
            <h4 className="residence-type">{residenceType}</h4>
            <p className="residence-description">{description}</p>
            <a className="btn btn-primary residence-btn" href="www.google.com" aria-label="See availability">
              See availability
            </a>
          </div>
          <div className="residence-price-container">
            <p className="residence-units-count">{unitsCount}</p>
            <p className="residence-price">{price}</p>
            <p className="residence-taxes">Includes taxes and fees</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResidenceCard;
