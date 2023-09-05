/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { useGetSingleAggregateResidenceQuery } from 'api/residence.api';
import axios from 'axios';
import ImageCardWrap from 'components/ImageCardWrap';
import ResidenceOverview from 'components/ResidenceOverview';
import Animate from 'components/common/Animate';
import Carousel from 'components/common/Carousel';
import Loader from 'components/common/Loader';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IImageData } from 'types/IImageData';
import { decryptData } from 'utils/urlSafety';

const Residence = () => {
  const { id: encryptedId } = useParams();
  const id = decodeURIComponent(decryptData(encryptedId!));
  const { data: residence, isLoading, isFetching } = useGetSingleAggregateResidenceQuery({ id });
  const [isFetchingImages, setIsFetchingImages] = useState<boolean>(false);
  const [imageData, setImageData] = useState<IImageData[]>([]);

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

  return (
    <>
      <Loader show={isLoading || isFetching || isFetchingImages} />
      <div className="residence-page-wrap">
        <Animate>
          <Carousel images={imageData} />

          <ResidenceOverview residence={residence?.data!} />
          <ImageCardWrap />
        </Animate>
      </div>
    </>
  );
};

export default Residence;
