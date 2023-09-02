import React, { useState } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { IImageData } from 'types/IImageData';

type ICarouselProps = {
  images: IImageData[];
};

const Carousel = ({ images }: ICarouselProps) => {
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
        <Slider>
          {images.map((image: IImageData, index) => {
            return (
              <Slide index={index} className={`slide ${image.id}`}>
                <img src={image.image} alt="home" />
              </Slide>
            );
          })}
        </Slider>
        <ButtonBack
          className={`button-back carousel-button ${activeIndex === 0 ? 'd-none' : ''}`}
          onClick={() => setActiveIndex(activeIndex - 1)}
        >
          B
        </ButtonBack>
        <ButtonNext
          className={`button-next carousel-button ${activeIndex === images.length - 1 ? 'd-none' : ''}`}
          onClick={() => setActiveIndex(activeIndex + 1)}
        >
          N
        </ButtonNext>
      </CarouselProvider>
      <div className="two-carousels">
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
            {images.map((image: IImageData, index) => {
              return (
                <Slide index={index} className={`slide ${image.id}`}>
                  <img src={image.image} alt="home" />
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
            {images.map((image: IImageData, index) => {
              return (
                <Slide index={index} className={`slide ${image.id}`}>
                  <img src={image.image} alt="home" />
                </Slide>
              );
            })}
          </Slider>
        </CarouselProvider>
      </div>
    </div>
  );
};

export default Carousel;
