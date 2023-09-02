/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Form, Row, Image } from 'react-bootstrap';
import Animate from 'components/common/Animate';
import Loader from 'components/common/Loader';
import ActionMessages, { ActionMessagesRef } from 'components/common/ActionMessages';
import Dropdown from 'components/common/Dropdown';
import Input from 'components/common/Input';
import { useGetCountriesRegionsCitiesQuery } from 'api/country.api';
import { ICountryRegionCityResponseDTO, ICustomCityDTO, ICustomRegionDTO } from 'types/country.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IDropdown } from 'types/IDropdown.types';
import { useGetResidenceTypeesQuery } from 'api/residenceTypes.api';
import { IResidenceType } from 'types/residence.types';
import { useCreateAddressMutation } from 'api/address.api';
import { useUploadImageMutation } from 'api/images.api';
import { useCreateResidenceMutation } from 'api/residence.api';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'app/store';
import { useNavigate } from 'react-router';
import routes from 'routes/routes';

const CreateResidence = () => {
  /* Redux API Hooks */
  const { data: residenceTypes, isLoading: isLoadRT, isFetching: isFetchRT } = useGetResidenceTypeesQuery(null);
  const { data: countryRegionCities, isLoading: isLoadC, isFetching: isFetchC } = useGetCountriesRegionsCitiesQuery(null);
  const [createAddress] = useCreateAddressMutation();
  const [uploadImage] = useUploadImageMutation();
  const [createResidence, { isLoading: isLoadingResidencePost }] = useCreateResidenceMutation();
  /* Dropdown data */
  const [regionDropdownData, setRegionDropdownData] = useState<IDropdown[]>([]);
  const [cityDropdownData, setCityDropdownData] = useState<IDropdown[]>([]);
  /* Model prop states */
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [description, setDescription] = useState('');
  /* Images */
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [fileList, setFileList] = useState<FileList | null>(null);
  /* Ref to call ActionMessage function */
  const actionMessagesRef = useRef<ActionMessagesRef>(null);
  /* Get current user */
  const { user } = useSelector(selectAuthentication);
  const navigate = useNavigate();

  useEffect(() => {
    const countryRegions = countryRegionCities?.data.find((c: ICountryRegionCityResponseDTO) => c.id === country)?.regions;
    const regionDropdownOptions = countryRegions?.map((c: ICustomRegionDTO) => {
      return { id: c.id, name: c.name };
    });
    setRegionDropdownData(regionDropdownOptions || []);

    const regionCities = countryRegions?.find((r: ICustomRegionDTO) => r.id === region)?.cities;
    const cityDropdownOptions = regionCities?.map((c: ICustomCityDTO) => {
      return { id: c.id, name: c.name };
    });
    setCityDropdownData(cityDropdownOptions || []);
  }, [country, region]);

  const countryDropdownOptions = countryRegionCities?.data.map((c: ICountryRegionCityResponseDTO) => {
    return { id: c.id, name: c.name };
  });
  const residenceTypeDropdownOptions = residenceTypes?.data.map((r: IResidenceType) => {
    return { id: r.id, name: r.name };
  });

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

  async function addAddress(residenceId: string) {
    await createAddress({ residenceId, street, additional: additionalInfo, cityId: city });
  }

  async function addImages(residenceId: string) {
    for (let i = 0; i < fileList!.length; i += 1) {
      const file = fileList![i];
      const imageDataPost = new FormData();
      imageDataPost.append('imageFile', file);
      imageDataPost.append('residenceId', residenceId);
      uploadImage(imageDataPost).unwrap();
    }
  }

  async function addResidence(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const userId = user!.id;
    await createResidence({ name, description, typeId: type, ownerId: userId })
      .unwrap()
      .then((residenceData) => {
        const residenceId = residenceData.data.id;
        addAddress(residenceId);
        addImages(residenceId);
        navigate(routes.RenterResidences.absolutePath, { state: { newResidence: residenceData.data.name } });
      })
      .catch((error) => {
        console.error('Error creating residence:', error);
      });
  }

  return (
    <>
      <Loader show={isLoadC || isFetchC || isLoadRT || isFetchRT || isLoadingResidencePost} />
      <Row className="crud-wrap flex-column gap-2 mt-4">
        <h3>Create New Residence</h3>
        <hr />
        <Row className="actions-wrap flex-column gap-2 align-items-start">
          <Animate>
            <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form">
              <Card.Body>
                <Form onSubmit={addResidence}>
                  <Row className="gap-4">
                    <Row className="justify-content-between ">
                      <Col md={6} className="mb-3">
                        <h5 className="mb-4">New Residence</h5>
                      </Col>
                      <Col sm={12} md={4} className="mb-3">
                        <Button variant="warning" type="submit" className="w-100">
                          Create
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Input value={name} setValue={setName} label="Name" />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Dropdown value={type} setValue={setType} label="Type" options={residenceTypeDropdownOptions} />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4} className="mb-3">
                        <Dropdown value={country} setValue={setCountry} label="Country" options={countryDropdownOptions} />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Dropdown
                          value={region}
                          setValue={setRegion}
                          label="Region"
                          options={regionDropdownData}
                          disabled={regionDropdownData.length === 0}
                        />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Dropdown
                          value={city}
                          setValue={setCity}
                          label="City"
                          options={cityDropdownData}
                          disabled={cityDropdownData.length === 0}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Input value={street} setValue={setStreet} label="Street" />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Input
                          value={additionalInfo}
                          setValue={setAdditionalInfo}
                          label="Additional Info"
                          required={false}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Input value={description} setValue={setDescription} label="Description" type="multiline" />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} className="mb-3">
                        <span className="m-0 mt-2 text-muted">Select images: </span>
                      </Col>
                      <Col md={12} className="mb-1">
                        <Form.Control
                          type="file"
                          className="text-primary mb-2"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelection}
                        />
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
                                  onClick={() => deleteImage(index)}
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} className="" size="xl" />
                                </Button>
                                <Image src={image.toString()} className="img-fluid object-fit-cover image-uploader__image" />
                              </Card>
                            </Col>
                          ))}
                        </>
                      )}
                    </Row>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Animate>
          <ActionMessages ref={actionMessagesRef} />
        </Row>
      </Row>
    </>
  );
};

export default CreateResidence;
