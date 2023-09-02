/* eslint-disable func-names */
/* eslint-disable react/no-array-index-key */
import { useDeleteImageMutation, useUploadImageMutation } from 'api/images.api';
import React, { RefObject, useState } from 'react';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Form, Row, Image, Button } from 'react-bootstrap';
import { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import DeleteModalMessage from 'components/common/DeleteModalMessage';
import Carousel from 'components/common/Carousel';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryDefinition } from '@reduxjs/toolkit/dist/query';
import IResponse from 'types/IResponse';
import { IImageData } from 'types/IImageData';

interface ITabEditResidenceImagesProps {
  foreignKeyId: string;
  imageForeignKey: string;
  actionMessageRef: RefObject<ActionMessagesRef>;
  imageData: IImageData[];
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      {
        q: string;
      },
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      IResponse<string[]>,
      'rootApi'
    >
  >;
}

const TabEditResidenceImages = ({
  foreignKeyId,
  actionMessageRef,
  imageData,
  refetch,
  imageForeignKey,
}: ITabEditResidenceImagesProps) => {
  const [deleteImage] = useDeleteImageMutation();
  const [uploadImage] = useUploadImageMutation();
  const [dataId, setDataId] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [isAddingImages, setIsAddingImages] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  /* Images functions */
  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    setFileList(files);

    const imagePreviewList: string[] = [];
    Array.prototype.forEach.call(files, function (file) {
      imagePreviewList.push(URL.createObjectURL(file));
    });

    setImagePreview(imagePreviewList);
  };

  const deletePreviewImage = (index: number) => {
    const imagePreviewList = [...imagePreview];
    imagePreviewList.splice(index, 1);

    const updatedFileList = fileList ? Array.from(fileList) : [];
    updatedFileList.splice(index, 1);

    const newFileList = new DataTransfer();
    updatedFileList.forEach((file) => newFileList.items.add(file));

    setImagePreview(imagePreviewList);
    setFileList(newFileList.files);
  };

  const onDeleteImage = (id: string) => {
    setShowDeleteModal(true);
    setDataId(id);
  };

  async function deleteImageFromResidence() {
    setShowDeleteModal(false);
    await deleteImage({ id: dataId })
      .unwrap()
      .then(() => {
        actionMessageRef.current!.createMessage('Image deleted', MessageType.Ok);
        refetch();
      })
      .catch((err) => {
        actionMessageRef.current!.createMessage(err.data.message, MessageType.Error);
        refetch();
      });
  }

  async function addImages() {
    const promises = [];

    for (let i = 0; i < fileList!.length; i += 1) {
      const file = fileList![i];
      const imageDataPost = new FormData();
      imageDataPost.append('imageFile', file);
      imageDataPost.append(imageForeignKey, foreignKeyId);
      promises.push(uploadImage(imageDataPost));
    }

    try {
      await Promise.all(promises); // Wait for all image uploads to complete
      actionMessageRef.current!.createMessage('Images uploaded', MessageType.Ok);
      refetch(); // Call the refetch function
      setFileList(null);
      setImagePreview([]);
      setIsAddingImages(false);
    } catch (error) {
      actionMessageRef.current!.createMessage('Error uploading images', MessageType.Error);
    }
  }

  return (
    <Row className="gap-4 gap-xl-0">
      <Col sm={12} className="mb-sm-4 mb-md-0">
        <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form h-100">
          <Card.Body>
            <Row className="gap-4">
              <Row className="justify-content-between ">
                <Col md={12} lg={8} className="mb-3">
                  <h5>Images</h5>
                </Col>
                {!isAddingImages && (
                  <Col md={12} lg={4}>
                    <Button variant="primary" className="w-100" onClick={() => setIsAddingImages(!isAddingImages)}>
                      Add More Images
                    </Button>
                  </Col>
                )}
              </Row>
              {isAddingImages && (
                <>
                  <Form.Label className="fw-bold ">
                    {imagePreview.length > 0 ? `Selected images (${imagePreview.length} selected)` : 'Select images'}
                  </Form.Label>
                  <Row className="w-100 gap-sm-3 gap-xl-0">
                    <Col xl={imagePreview.length > 0 ? 8 : 10}>
                      <Form.Control
                        type="file"
                        className="text-primary mb-2"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelection}
                      />
                    </Col>
                    {imagePreview.length > 0 && (
                      <Col xl={2}>
                        <Button variant="primary" type="submit" className="w-100" onClick={addImages}>
                          Save
                        </Button>
                      </Col>
                    )}
                    <Col xl={2}>
                      <Button variant="danger" className="w-100" onClick={() => setIsAddingImages(!isAddingImages)}>
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                  <Row className="image-uploader__image-container">
                    {imagePreview.length > 0 && (
                      <>
                        <Col md={12} className="mb-3 px-3">
                          <span className="m-0 mt-2 text-muted">Preview images:</span>
                        </Col>
                        {imagePreview.map((image: string, index: number) => (
                          <Col sm={12} md={12} lg={4} key={index} className="mb-4">
                            <Card className="shadow-lg  p-0 overflow-hidden image-uploader__card position-relative">
                              <Button
                                className="text-white position-absolute end-0 rounded-5 p-2 m-1 delete-image-button"
                                onClick={() => deletePreviewImage(index)}
                              >
                                <FontAwesomeIcon icon={faCircleXmark} className="" size="xl" />
                              </Button>
                              <Image src={image.toString()} className="img-fluid object-fit-cover image-uploader__image" />
                            </Card>
                          </Col>
                        ))}
                      </>
                    )}
                    <hr className="w-100" />
                  </Row>
                </>
              )}
              <Row className="image-uploader__image-container">
                {imageData.length > 0 && (
                  <>
                    <Col md={12} className="mb-3 px-3">
                      <h6 className="m-0 mt-2 text-primary ">Residence Gallery:</h6>
                    </Col>
                    {imageData.map((data: IImageData, index: number) => (
                      <Col sm={12} md={12} lg={4} key={index} className="mb-4">
                        <Card className="shadow-lg  p-0 overflow-hidden image-uploader__card position-relative">
                          <Button
                            className="text-white position-absolute end-0 rounded-5 p-2 m-1 delete-image-button"
                            onClick={() => onDeleteImage(data.id)}
                          >
                            <FontAwesomeIcon icon={faCircleXmark} className="" size="xl" />
                          </Button>
                          <Image src={data.image} className="img-fluid object-fit-cover image-uploader__image" />
                        </Card>
                      </Col>
                    ))}
                  </>
                )}
                {imageData.length === 0 && (
                  <Col md={12} className="mb-3 px-3 text-center ">
                    <h5 className="m-0 mt-2 text-muted">No images found</h5>
                  </Col>
                )}
              </Row>
              {imageData.length > 0 && (
                <Row>
                  <Carousel images={imageData} />
                </Row>
              )}
            </Row>
          </Card.Body>
        </Card>
        <DeleteModalMessage
          showModal={showDeleteModal}
          id={dataId}
          resetState={() => setShowDeleteModal(false)}
          doAction={deleteImageFromResidence}
          headerMsg="You are about to delete image?"
          bodyMsg="Are you sure you want to delete this image? Image will no longer be publicly visible!"
        />
      </Col>
    </Row>
  );
};
export default TabEditResidenceImages;
