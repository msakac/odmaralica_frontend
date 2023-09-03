import React from 'react';
import ImageCard from './ImageCard'; // Make sure to import your ImageCard component

type CardData = {
  id?: string;
  name?: string;
  propertyCount?: number;
  image?: string;
  link?: string;
};

type Props = {
  id?: string;
  title?: string;
  description?: string;
  cards?: CardData[];
};

const ImageCardWrap = ({
  id = 'card',
  title = 'Enjoy your dream vacation',
  description = 'Plan and book your perfect trip with expert advice, travel tips, destination information, and inspiration from us',
  cards = [
    {
      id: 'card1',
      name: 'Australia',
      propertyCount: 2246,
      image: 'https://i.ibb.co/0Vqv9ym/out-door-image.png',
      link: 'https://www.google.hr/',
    },
    {
      id: 'card2',
      name: 'Japan',
      propertyCount: 1278,
      image: 'https://i.ibb.co/0Vqv9ym/out-door-image.png',
      link: 'https://www.google.hr/',
    },
    {
      id: 'card3',
      name: 'New Zealand',
      propertyCount: 480,
      image: 'https://i.ibb.co/0Vqv9ym/out-door-image.png',
      link: 'https://www.google.hr/',
    },
    {
      id: 'card4',
      name: 'Greece',
      propertyCount: 320,
      image: 'https://i.ibb.co/0Vqv9ym/out-door-image.png',
      link: 'https://www.google.hr/',
    },
  ],
}: Props) => {
  return (
    <div className="card-wrap-container" id={id}>
      <div className="card-wrap-content">
        <h2 className="card-wrap-content-title">{title}</h2>
        <p className="card-wrap-content-desc">{description}</p>
      </div>
      <div className="card-list">
        {cards.map((cardData) => (
          <ImageCard
            key={cardData.id}
            id={cardData.id}
            name={cardData.name}
            propertyCount={cardData.propertyCount}
            image={cardData.image}
            link={cardData.link}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCardWrap;
