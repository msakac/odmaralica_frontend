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
import EditResidenceAddress from 'components/residence/EditResidenceAddress';
import EditResidenceImages from 'components/residence/EditResidenceImages';
import { useGetUsersQuery } from 'api/users.api';
import CustomCheckbox from 'components/common/CustomCheckbox';

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
  const { id: encryptedId } = useParams();
  const id = decodeURIComponent(decryptData(encryptedId!));
  const { data: users, isLoading: isLoadingUsers, isFetching: isFetchingUsers } = useGetUsersQuery(null);
  const { data: residenceTypes, isLoading, isFetching } = useGetResidenceTypeesQuery(null);
  const {
    data: queryData,
    isLoading: isLoadResidence,
    isFetching: isFetchResidence,
    refetch,
  } = useGetSingleResidenceQuery({ id });

  const [updateResidence] = useUpdateResidenceMutation();
  const [residenceData, setResidenceData] = useState<IResidencePutDTO>(initialResidenceData);
  const actionMessagesRef = useRef<ActionMessagesRef>(null);

  useEffect(() => {
    if (queryData) {
      const ownerId = users?.data.find((u) => u.email === queryData.data!.owner.email);
      const { type, owner, ...restData } = queryData.data!;
      const putResidence = {
        typeId: type.id,
        ownerId: ownerId!.id,
        ...restData,
      };
      setResidenceData(putResidence);
    }
  }, [queryData]);

  const residenceTypeDropdownOptions = residenceTypes?.data.map((r: IResidenceType) => {
    return { id: r.id, name: r.name };
  });

  async function onSubmitUpdateResidence(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateResidence(residenceData!)
      .unwrap()
      .then((dataUpdate) => {
        const message = `[${dataUpdate.status}] Updated row with ID: ${dataUpdate.data.id}`;
        actionMessagesRef.current!.createMessage(message, MessageType.Ok);
        refetch();
      })
      .catch((err) => {
        actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  return (
    <>
      <Loader show={isFetchResidence || isFetching || isLoadResidence || isLoading || isLoadingUsers || isFetchingUsers} />
      <Row className="crud-wrap flex-column gap-2 mt-4">
        <h3>Edit Residence - {residenceData!.name}</h3>
        <hr />
        <Row className="edit-residence-wrap flex-column gap-4 align-items-start">
          <Row>
            <Col md={12} className="mb-3">
              <ActionMessages ref={actionMessagesRef} />
            </Col>
          </Row>
          {residenceData.isPublished ? (
            <h6 className="text-success">This Residence is Published</h6>
          ) : (
            <h6 className="text-danger">This Residence is Not Published</h6>
          )}
          <Row className="gap-4 gap-xl-0">
            <Col lg={12} xl={6} className="mb-sm-4 mb-md-0">
              <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form h-100">
                <Card.Body>
                  <Form onSubmit={onSubmitUpdateResidence}>
                    <Row className="gap-4">
                      <Row className="justify-content-between ">
                        <Col md={6} className="mb-3">
                          <h5 className="mb-0 mb-lg-4">Residence Details</h5>
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
                      <Row>
                        <Col md={6}>
                          <CustomCheckbox
                            value={residenceData.isAirConFree || false}
                            label="Free Air Conditioner "
                            setValue={(e) => setResidenceData({ ...residenceData!, isAirConFree: e })}
                          />
                        </Col>
                        <Col md={6}>
                          <Input
                            value={residenceData!.distanceBeach || ''}
                            type="number"
                            setValue={(e) => {
                              setResidenceData({ ...residenceData!, distanceBeach: e });
                            }}
                            label="Distance from Beach"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <CustomCheckbox
                            value={residenceData.isParkingFree || false}
                            label="Free Parking "
                            setValue={(e) => setResidenceData({ ...residenceData!, isParkingFree: e })}
                          />
                        </Col>
                        <Col md={6}>
                          <Input
                            value={residenceData!.distanceCenter || ''}
                            type="number"
                            setValue={(e) => {
                              setResidenceData({ ...residenceData!, distanceCenter: e });
                            }}
                            label="Distance from Center"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <CustomCheckbox
                            value={residenceData.isWifiFree || false}
                            label="Free Wi-Fi "
                            setValue={(e) => setResidenceData({ ...residenceData!, isWifiFree: e })}
                          />
                        </Col>
                        <Col md={6}>
                          <Input
                            value={residenceData!.distanceSea || ''}
                            type="number"
                            setValue={(e) => {
                              setResidenceData({ ...residenceData!, distanceSea: e });
                            }}
                            label="Distance from Sea"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} />
                        <Col md={6}>
                          <Input
                            value={residenceData!.distanceStore || ''}
                            type="number"
                            setValue={(e) => {
                              setResidenceData({ ...residenceData!, distanceStore: e });
                            }}
                            label="Distance from Store"
                          />
                        </Col>
                      </Row>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={12} xl={6}>
              <EditResidenceAddress residenceId={id} actionMessageRef={actionMessagesRef} />
            </Col>
          </Row>
          <Row>
            <EditResidenceImages residenceId={id} actionMessageRef={actionMessagesRef} />
          </Row>
        </Row>
      </Row>
    </>
  );
};

export default EditResidence;
