import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Loader from 'components/common/Loader';
import ActionMessages, { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import Dropdown from 'components/common/Dropdown';
import Input from 'components/common/Input';
import { useGetResidenceTypeesQuery } from 'api/residenceTypes.api';
import { IResidencePutDTO, IResidenceType } from 'types/residence.types';
import { useGetSingleResidenceQuery, useUpdateResidenceMutation } from 'api/residence.api';
import { useParams } from 'react-router-dom';
import { decryptData } from 'utils/urlSafety';
import { useLazyGetUsersQuery } from 'api/users.api';
import CustomCheckbox from 'components/common/CustomCheckbox';
import { Tab, Tabs } from '@mui/material';
import { useFindImagesQuery } from 'api/images.api';
import axios from 'axios';
import { useFindAccommodationUnitsQuery } from 'api/accommodationUnit.api';
import { useSearhText } from 'components/layout/SidebarLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { selectAuthentication } from 'app/store';
import { useSelector } from 'react-redux';
import TabEditResidenceImages from 'components/residence/TabEditImages';
import TabEditResidenceAddress from 'components/residence/TabEditResidenceAddress';
import EditAccommodationUnit from 'components/residence/accommodationUnit/EditAccommodationUnit';
import { IAccommodationUnitGetDTO } from 'types/accommodationUnit.types';
import { IImageData } from 'types/IImageData';
import AccommodationUnits from '../components/residence/accommodationUnit/TabAccommodationUnits';

const initialResidenceData: IResidencePutDTO = {
  id: '',
  name: '',
  description: '',
  typeId: '',
  isPublished: false,
  ownerId: '',
  isParkingFree: false,
  isWifiFree: false,
  isAirConFree: false,
  distanceSea: '',
  distanceStore: '',
  distanceBeach: '',
  distanceCenter: '',
};

const EditResidence = () => {
  /* Residence id from URL */
  const { id: encryptedId } = useParams();

  /* States and data */
  const id = decodeURIComponent(decryptData(encryptedId!));
  const [imageData, setImageData] = useState<IImageData[]>([]);
  const [currentTab, setCurrentTab] = useState('residence_details');
  const [currentAccUnit, setCurrentAccUnit] = useState<IAccommodationUnitGetDTO | undefined>(undefined);
  const [isFetchingImages, setIsFetchingImages] = useState<boolean>(false);
  const [residenceData, setResidenceData] = useState<IResidencePutDTO>(initialResidenceData);
  const actionMessagesRef = useRef<ActionMessagesRef>(null);
  /* Outlet context for searching */
  const { searchText } = useSearhText();
  /* Get user */
  const { user } = useSelector(selectAuthentication);
  const [fetchUsers, users] = useLazyGetUsersQuery();
  const {
    data: imageIds,
    isLoading: isLoadingImageIds,
    isFetching: isFetchingImageIds,
    refetch: refetchImages,
  } = useFindImagesQuery({ q: `residence.id=${id}` });

  const { data: residenceTypes, isLoading, isFetching } = useGetResidenceTypeesQuery(null);
  const {
    data: queryData,
    isLoading: isLoadResidence,
    isFetching: isFetchResidence,
    refetch,
  } = useGetSingleResidenceQuery({ id });

  const [updateResidence] = useUpdateResidenceMutation();
  const {
    data: accommodationUnitsData,
    isLoading: isLoadingAccommodationUnits,
    isFetching: isFetchingAccommodationUnits,
    refetch: refetchAccommodationUnits,
  } = useFindAccommodationUnitsQuery({ q: `residence.id=${id}` });

  /* Use Effect to fetch images when imageIds are changes */
  useEffect(() => {
    async function getImages() {
      if (!imageIds || imageIds.data.length === 0) return;
      setIsFetchingImages(true);
      try {
        const imagePromises = imageIds!.data.map(async (imageId) => {
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
        actionMessagesRef.current!.createMessage('Error fetching images', MessageType.Error);
      }
    }
    getImages();
  }, [imageIds]);

  /* Use Effect to set residence state */
  useEffect(() => {
    if (queryData) {
      let ownerId = '';
      /* Because im using same page for renter and admin there are 2 cases */
      /* If renter then he is the owner and get his id */
      /* If admin I have to fetch all users and find owner because of DTO Residence has no owner ID */
      if (queryData.data.owner.email === user?.email) {
        ownerId = user.id;
      } else if (!users.data) {
        fetchUsers(null);
      } else {
        ownerId = users!.data!.data!.find((u) => u.email === queryData.data!.owner.email)!.id;
      }
      const { type, owner, ...restData } = queryData.data!;
      const putResidence = {
        typeId: type.id,
        ownerId,
        ...restData,
      };
      setResidenceData(putResidence);
    }
  }, [queryData, users]);

  /* Dropdown data for residence type */
  const residenceTypeDropdownOptions = residenceTypes?.data.map((r: IResidenceType) => {
    return { id: r.id, name: r.name };
  });

  /* Update residence api handler */
  async function onSubmitUpdateResidence(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateResidence(residenceData!)
      .unwrap()
      .then((dataUpdate) => {
        const message = `[${dataUpdate.status}] Updated Residence: ${dataUpdate.data.name}`;
        actionMessagesRef.current!.createMessage(message, MessageType.Ok);
        refetch();
      })
      .catch((err) => {
        actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  /* Tab change handler */
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentAccUnit(undefined);
    setCurrentTab(newValue);
  };

  const handleEditAccUnitClick = (accUnitId: string) => {
    setCurrentTab('acc_unit_edit');
    const accUnit = accommodationUnitsData?.data.find((acc) => acc.id === accUnitId);
    setCurrentAccUnit(accUnit);
  };

  return (
    <>
      <Loader
        show={
          isFetchResidence ||
          isFetching ||
          isLoadResidence ||
          isLoading ||
          isFetchingImageIds ||
          isLoadingImageIds ||
          isFetchingImages ||
          isLoadingAccommodationUnits ||
          isFetchingAccommodationUnits
        }
      />
      <h6 className="my-3">
        Residence <FontAwesomeIcon icon={faArrowRight} size="sm" /> {residenceData!.name}{' '}
        {!residenceData.isPublished && <span className="text-danger">(Not Published)</span>}
      </h6>
      <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form h-100">
        <Card.Body>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="secondary"
            variant="scrollable"
            indicatorColor="secondary"
            className="residence-tabs"
          >
            <Tab value="residence_details" label="Details & Address" />
            <Tab value="residence_images" label="Residence Galery" />
            <Tab value="accommodation_units" label="Accommodation Units" />
            <Tab value="reviews" label="Reviews" />
            {currentAccUnit && <Tab value="acc_unit_edit" label={currentAccUnit.name} />}
          </Tabs>
          <Row className="crud-wrap flex-column gap-2 mt-4">
            <hr className="m-0" />
            <Row className="edit-residence-wrap flex-column gap-4 align-items-start">
              <Row>
                <Col md={12}>
                  <ActionMessages ref={actionMessagesRef} />
                </Col>
              </Row>
              {currentTab === 'residence_details' && (
                <Row className="gap-4 gap-xl-0">
                  <Col lg={12} xl={6} className="mb-sm-4 mb-md-0">
                    <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form h-100">
                      <Card.Body>
                        <Form onSubmit={onSubmitUpdateResidence}>
                          <Row className="gap-4">
                            <Row className="justify-content-between ">
                              <Col md={6} className="mb-3">
                                <h5 className="mb-0 mb-lg-4">Details</h5>
                              </Col>
                              <Col md={12} lg={4} className="mb-3">
                                <Button variant="warning" type="submit" className="w-100">
                                  Update
                                </Button>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6} className="mb-3">
                                <Input
                                  value={residenceData!.name}
                                  setValue={(e) => {
                                    setResidenceData({ ...residenceData!, name: e });
                                  }}
                                  label="Name"
                                />
                              </Col>
                              <Col md={6} className="mb-3">
                                <Dropdown
                                  value={residenceData!.typeId}
                                  setValue={(e) => {
                                    setResidenceData({ ...residenceData!, typeId: e });
                                  }}
                                  label="Type"
                                  options={residenceTypeDropdownOptions}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col md={12} className="mb-3">
                                <Input
                                  name="description"
                                  value={residenceData!.description}
                                  setValue={(e) => {
                                    setResidenceData({ ...residenceData!, description: e });
                                  }}
                                  label="Description"
                                  type="multiline"
                                />
                              </Col>
                            </Row>
                            <Row className="gap-sm-2 gap-md-0">
                              <Col md={6}>
                                <Row className="flex-col gap-2 ">
                                  <CustomCheckbox
                                    value={residenceData.isAirConFree || false}
                                    label="Free Air Conditioner "
                                    setValue={(e) => setResidenceData({ ...residenceData!, isAirConFree: e })}
                                  />
                                  <CustomCheckbox
                                    value={residenceData.isParkingFree || false}
                                    label="Free Parking "
                                    setValue={(e) => setResidenceData({ ...residenceData!, isParkingFree: e })}
                                  />
                                  <CustomCheckbox
                                    value={residenceData.isWifiFree || false}
                                    label="Free Wi-Fi "
                                    setValue={(e) => setResidenceData({ ...residenceData!, isWifiFree: e })}
                                  />
                                </Row>
                              </Col>

                              <Col md={6}>
                                <Row className="flex-col gap-4">
                                  <Input
                                    value={residenceData!.distanceCenter || ''}
                                    type="number"
                                    setValue={(e) => {
                                      setResidenceData({ ...residenceData!, distanceCenter: e });
                                    }}
                                    label="Distance from Center"
                                    help="All distances are in meters"
                                  />
                                  <Input
                                    value={residenceData!.distanceBeach || ''}
                                    type="number"
                                    setValue={(e) => {
                                      setResidenceData({ ...residenceData!, distanceBeach: e });
                                    }}
                                    label="Distance from Beach"
                                  />
                                  <Input
                                    value={residenceData!.distanceSea || ''}
                                    type="number"
                                    setValue={(e) => {
                                      setResidenceData({ ...residenceData!, distanceSea: e });
                                    }}
                                    label="Distance from Sea"
                                  />
                                  <Input
                                    value={residenceData!.distanceStore || ''}
                                    type="number"
                                    setValue={(e) => {
                                      setResidenceData({ ...residenceData!, distanceStore: e });
                                    }}
                                    label="Distance from Store"
                                  />
                                </Row>
                              </Col>
                            </Row>
                          </Row>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={12} xl={6}>
                    <TabEditResidenceAddress residenceId={id} actionMessageRef={actionMessagesRef} />
                  </Col>
                </Row>
              )}
              {currentTab === 'residence_images' && (
                <TabEditResidenceImages
                  foreignKeyId={id}
                  actionMessageRef={actionMessagesRef}
                  imageData={imageData}
                  refetch={refetchImages}
                  imageForeignKey="residenceId"
                />
              )}
              {currentTab === 'accommodation_units' && !currentAccUnit && (
                <AccommodationUnits
                  data={accommodationUnitsData!.data}
                  searchText={searchText}
                  actionMessagesRef={actionMessagesRef}
                  refetch={refetchAccommodationUnits}
                  residenceId={id}
                  onEditAccUnitClick={handleEditAccUnitClick}
                />
              )}
              {currentTab === 'reviews' && <div>Reviews</div>}
              {/* refetch for acc units, accUnitId, residenceId, treba mi messageRef */}
              {currentAccUnit && (
                <EditAccommodationUnit
                  actionMessagesRef={actionMessagesRef}
                  object={currentAccUnit}
                  refetch={refetchAccommodationUnits}
                />
              )}
            </Row>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default EditResidence;
