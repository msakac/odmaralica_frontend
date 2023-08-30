import React from 'react';

type Props = {
  id?: string;
  name?: string;
  residenceType?: string;
  description?: string;
  unitsCount?: string;
  price?: string;
  reviewsCount?: number;
  avgReview?: number;
  image?: string;
  link?: string;
};

const ResidenceCard = ({
  id = 'residence',
  name = 'Julia Dens Resort',
  residenceType = 'Live a little and celebrate with champagne',
  description = 'Reats include a glass of French champagne, parking and a late checkout. Gym included. Flexible cancellation applies',
  unitsCount = '1 room 2 days',
  price = '$240',
  reviewsCount = 1200,
  avgReview = 4.5,
  image = 'https://i.ibb.co/0Vqv9ym/out-door-image.png',
  link = 'See availability',
}: Props) => {
  return (
    <div className="residence-container" id={id}>
      <div className="residence-image-container">
        <picture>
          <source media="(min-width: 992px)" srcSet={image} />
          <img src={image} alt="Out door house" />
        </picture>
      </div>
      <div className="residence-content-container">
        <div className="residence-info-container">
          <h3 className="residence-name">{name}</h3>
          <div className="residence-ratings">
            <div className="star-ratings">4 stars</div>
            <span className="average-review">{avgReview}</span>
            <span className="reviews">({reviewsCount}) Reviews</span>
          </div>
          <h4 className="residence-type">{residenceType}</h4>
          <p className="residence-description">{description}</p>
          <a className="btn btn-primary residence-btn" href="www.google.com" aria-label="See availability">
            {link}
          </a>
        </div>
        <div className="residence-price-container">
          <p className="residence-units-count">{unitsCount}</p>
          <p className="residence-price">{price}</p>
          <p className="residence-taxes">Includes taxes and fees</p>
        </div>
      </div>
    </div>
  );
};

export default ResidenceCard;
