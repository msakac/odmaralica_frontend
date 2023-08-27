/* eslint-disable func-names */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Card, Container, Form, Row, Image, Button, Col } from 'react-bootstrap';
import axios from 'axios';

const ImageUploader = () => {
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [imageData, setImageData] = useState<string>('');

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    console.log(files);
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
    const imageDataLocal = new FormData();
    Array.prototype.forEach.call(fileList, function (file) {
      imageDataLocal.append('data', file);
    });

    console.log(imageDataLocal);
    console.log(imageDataLocal.get('data'));

    const imageDataTest = new FormData();
    imageDataTest.append('imageFile', fileList![0]);
    imageDataTest.append('imageName', 'name');

    // if (imageDataTest.entries().next().value[1] !== null) {
    //   const response = await axios.post('http://localhost:8080/image', imageDataTest, {
    //     onUploadProgress: (progressEvent) => {
    //       console.log(`Uploading : ${((progressEvent.loaded / progressEvent.total!) * 100).toString()}%`);
    //     },
    //   });
    // }

    const imageName = 'name';
    const imageUrl = `http://localhost:8080/image/${imageName}`;

    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      // Convert the image data to a base64 URL
      const base64Image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));

      setImageData(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.error('Error retrieving image:', error);
    }
  }

  return (
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
          <h6 className="m-0 mt-2">Preview: </h6>
          <Row className="mx-0 mt-3 border-top border-2 border-primary pt-4 w-100 d-flex flex-row flex-wrap justify-content-center align-items-center gap-3 image-uploader__image-container">
            {imagePreview.map((image: string, index: number) => (
              <Card key={index} className="shadow-xl p-0 overflow-hidden image-uploader__card position-relative">
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
      <div>{imageData && <img src={imageData} alt="Uploaded" />}</div>
    </Container>
  );
};

export default ImageUploader;
