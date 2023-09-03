import React from 'react';

type Props = {
  id?: string;
  name?: string;
  propertyCount?: number;
  image?: string;
  link?: string;
};

const ImageCard = ({ id, name, propertyCount, image, link }: Props) => {
  return (
    <div className="card-container" id={id}>
      <a href={link}>
        <div className="card-image-container">
          <picture>
            <img src={image} alt="Out door house" />
          </picture>
        </div>
        <div className="card-content-container">
          <h3 className="card-name">{name}</h3>
          <p>{propertyCount} properties</p>
        </div>
      </a>
    </div>
  );
};

export default ImageCard;
