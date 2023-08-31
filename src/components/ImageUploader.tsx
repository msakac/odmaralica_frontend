/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Card, Container, Form, Row, Image, Button, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'app/store';
import { useUploadImageMutation } from 'api/images.api';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import axios from 'axios';
import Loader from './common/Loader';

const ImageUploader = () => {
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [imageData, setImageData] = useState<string[]>([]);
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [isFetching, setIsFetching] = useState(false);

  // const [id, setImageId] = useState<string>('');
  // const [id, setImageId] = useState(skipToken);
  // const {
  //   data,
  //   isLoading: isLoadingGet,
  //   isFetching,
  // } = useGetImageQuery(
  //   { id },
  //   {
  //     skip: id === '',
  //   }
  // );

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    setFileList(files);

    const imagePreviewList: string[] = [];
    Array.prototype.forEach.call(files, function (file) {
      imagePreviewList.push(URL.createObjectURL(file));
    });

    setImagePreview(imagePreviewList);
  };

  const deleteImage = (index: number) => {
    const imagePreviewList = [...imagePreview];
    imagePreviewList.splice(index, 1);

    const updatedFileList = fileList ? Array.from(fileList) : [];
    updatedFileList.splice(index, 1);

    const newFileList = new DataTransfer();
    updatedFileList.forEach((file) => newFileList.items.add(file));

    setImagePreview(imagePreviewList);
    setFileList(newFileList.files);
  };

  async function addImages() {
    try {
      for (let i = 0; i < fileList!.length; i += 1) {
        console.log(i);
        const file = fileList![i];
        const imageDataPost = new FormData();
        imageDataPost.append('imageFile', file);
        imageDataPost.append('userId', '1');
        imageDataPost.append('accommodationUnitId', '4');
        imageDataPost.append('residenceId', '6');

        // eslint-disable-next-line no-await-in-loop
        await uploadImage(imageDataPost).unwrap();
        console.log(`Uploaded image ${i + 1}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getImage() {
    setIsFetching(true);
    const imageIds = ['1', '2', '3', '4', '5', '27', '28', '29', '35', '36', '37', '38'];
    // const headers = {
    //   'Authorization': 'Bearer YourAccessToken', // Replace with your actual authorization header
    //   'Content-Type': 'multipart/form-data', // Set the content type for the FormData
    // };
    try {
      const imagePromises = imageIds.map(async (imageId) => {
        const imageUrl = `http://localhost:8080/image/${imageId}`;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Convert the image data to a base64 URL
        const base64Image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        return `data:image/png;base64,${base64Image}`;
      });

      const newImageDataList = await Promise.all(imagePromises);
      setImageData(newImageDataList);
      setIsFetching(false);
    } catch (error) {
      console.log('Error fetching images:', error);
    }
  }

  return (
    <>
      <Loader show={isLoading || isFetching} />
      <Container fluid className="d-flex p-0 flex-column align-items-center justify-content-center ">
        <Row className="w-100">
          <Form.Group controlId="formFileMultiple" className="mb-3 p-0">
            <Form.Label className="fw-bold ">
              {' '}
              {imagePreview.length > 0 ? `Selected images (${imagePreview.length} selected)` : 'Select images'}
            </Form.Label>
            <Row className="w-100">
              <Col lg={imagePreview.length > 0 ? 8 : 12}>
                <Form.Control
                  type="file"
                  className="text-primary mb-2"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelection}
                />
              </Col>
              {imagePreview.length > 0 && (
                <Col>
                  <Button variant="primary" type="submit" className="w-100" onClick={addImages}>
                    Add images
                  </Button>
                </Col>
              )}
            </Row>
          </Form.Group>
        </Row>
        {imagePreview.length > 0 && (
          <Container fluid className="p-0">
            <span className="m-0 mt-2">Preview images: </span>
            <Row className="mx-0 mt-3 border-top border-2 border-dark-subtle  pt-4 w-100 d-flex flex-row flex-wrap justify-content-center align-items-center gap-3 image-uploader__image-container">
              {imagePreview.map((image: string, index: number) => (
                <Card key={index} className="shadow-lg  p-0 overflow-hidden image-uploader__card position-relative">
                  <Button
                    className="text-white position-absolute end-0 rounded-5 p-2 m-1 delete-image-button"
                    onClick={() => deleteImage(index)}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} className="" size="xl" />
                  </Button>
                  <Image src={image.toString()} className="img-fluid object-fit-cover image-uploader__image" />
                </Card>
              ))}
            </Row>
          </Container>
        )}
        <Col>
          <Button variant="primary" type="submit" className="w-100" onClick={getImage}>
            Get Images
          </Button>
        </Col>
        {imageData.length > 0 &&
          imageData.map((image: string, index: number) => (
            <div key={index}>
              <p>Slikica</p>
              <Image src={image} className="img-fluid object-fit-cover image-uploader__image" />
            </div>
          ))}
      </Container>
    </>
  );
};

export default ImageUploader;
