/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Loader from 'components/common/Loader';
import ActionMessages, { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import Dropdown from 'components/common/Dropdown';
import Input from 'components/common/Input';
import { useGetResidenceTypeesQuery } from 'api/residenceTypes.api';
import { IResidenceType } from 'types/residence.types';
import { useGetSingleResidenceQuery, useUpdateResidenceMutation } from 'api/residence.api';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'app/store';
import { useParams } from 'react-router-dom';
import { decryptData } from 'utils/urlSafety';
import EditResidenceAddress from 'components/residence/EditResidenceAddress';
import EditResidenceImages from 'components/residence/EditResidenceImages';

const EditResidence = () => {
  /* Redux API Hooks */
  const { id: encryptedId } = useParams();
  const id = decodeURIComponent(decryptData(encryptedId!));
  console.log(id);
  const { data: residenceTypes, isLoading, isFetching } = useGetResidenceTypeesQuery(null);
  const {
    data: residenceData,
    isLoading: isLoadResidence,
    isFetching: isFetchResidence,
    refetch,
  } = useGetSingleResidenceQuery({ id });

  const [updateResidence] = useUpdateResidenceMutation();
  /* Model prop states */
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  /* Ref to call ActionMessage function */
  const actionMessagesRef = useRef<ActionMessagesRef>(null);
  /* Get current user */
  const { user } = useSelector(selectAuthentication);

  useEffect(() => {
    if (residenceData) {
      setName(residenceData!.data.name);
      setType(residenceData!.data.type.id);
      setDescription(residenceData?.data.description || '');
    }
  }, [residenceData]);

  const residenceTypeDropdownOptions = residenceTypes?.data.map((r: IResidenceType) => {
    return { id: r.id, name: r.name };
  });

  async function onSubmitUpdateResidence(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedFields = {
      id,
      name,
      description,
      typeId: type,
      isPublished: residenceData!.data.isPublished,
      ownerId: user!.id,
    };
    await updateResidence(updatedFields)
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
      <Loader show={isFetchResidence || isFetching || isLoadResidence || isLoading} />
      <Row className="crud-wrap flex-column gap-2 mt-4">
        <h3>Edit Residence - {name}</h3>
        <hr />
        <Row className="actions-wrap flex-column gap-4 align-items-start">
          <Row>
            <Col md={12} className="mb-3">
              <ActionMessages ref={actionMessagesRef} />
            </Col>
          </Row>
          <Row>
            <Col lg={12} xl={6} className="mb-sm-4 mb-md-0">
              <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form h-100">
                <Card.Body>
                  <Form onSubmit={onSubmitUpdateResidence}>
                    <Row className="gap-4">
                      <Row className="justify-content-between ">
                        <Col md={6} className="mb-3">
                          <h5 className="mb-4">Details</h5>
                        </Col>
                        <Col sm={12} md={4} className="mb-3">
                          <Button variant="warning" type="submit" className="w-100">
                            Update
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
                        <Col md={12} className="mb-3">
                          <Input value={description} setValue={setDescription} label="Description" type="multiline" />
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
