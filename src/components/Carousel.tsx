import React, { useState } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

type Props = {
  id?: string;
  name?: string;
  images?: Array<string>;
};

const Carousel = ({
  id = 'carousel1',
  name = 'Pure Carousel',
  images = [
    'https://i.ibb.co/brFjykX/kitchen.png',
    'https://i.ibb.co/pyvymrG/house-with-balcony.png',
    'https://i.ibb.co/KxGYVbh/backyard.png',
    'https://i.ibb.co/59B4NXp/out-door-image.png',
  ],
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const correctedActiveIndex = activeIndex % images.length;
  const secondImageIndex = (correctedActiveIndex + 1) % images.length;
  const thirdImageIndex = (correctedActiveIndex + 2) % images.length;

  return (
    <div className="carousel-container">
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={images.length}
        currentSlide={correctedActiveIndex}
        infinite
        dragEnabled={false}
        className="main-carousel"
      >
        <Slider className={name}>
          {images.map((image, key) => {
            return (
              <Slide index={key} className={`slide ${id}`}>
                <img src={image} alt="home" />
              </Slide>
            );
          })}
        </Slider>
        <ButtonBack className="button-back carousel-button" onClick={() => setActiveIndex(activeIndex - 1)}>
          B
        </ButtonBack>
        <ButtonNext className="button-next carousel-button" onClick={() => setActiveIndex(activeIndex + 1)}>
          N
        </ButtonNext>
      </CarouselProvider>
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={images.length}
        currentSlide={secondImageIndex}
        infinite
        dragEnabled={false}
        className="second-carousel"
      >
        <Slider>
          {images.map((image, key) => {
            return (
              <Slide index={key} className={`slide ${id}`}>
                <img src={image} alt="home" />
              </Slide>
            );
          })}
        </Slider>
      </CarouselProvider>

      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={images.length}
        currentSlide={thirdImageIndex}
        infinite
        dragEnabled={false}
        className="third-carousel"
      >
        <Slider>
          {images.map((image, key) => {
            return (
              <Slide index={key} className={`slide ${id}`}>
                <img src={image} alt="home" />
              </Slide>
            );
          })}
        </Slider>
      </CarouselProvider>
    </div>
  );
};

export default Carousel;
