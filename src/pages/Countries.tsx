import React, { useEffect, useRef, useState } from 'react';
import {
  useDeleteCountryMutation,
  useGetCountriesQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
} from 'api/country.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { useSearhText } from 'components/layout/SidebarLayout';
import { getCountryColumns, getCountryRows } from 'components/data/DataTableConfigs';
import Animate from 'components/common/Animate';
import Loader from 'components/common/Loader';
import ActionMessages, { Action, ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import DataTable from 'components/data/DataTable';
import DeleteModalMessage from 'components/common/DeleteModalMessage';
import { ICountry } from 'types/country.types';

const Countries = () => {
  /* Redux API Hooks */
  const { data, isLoading, isFetching, refetch } = useGetCountriesQuery(null);
  const [createCountry, { isLoading: isLoadingPost }] = useCreateCountryMutation();
  const [updateCountry, { isLoading: isLoadingPut }] = useUpdateCountryMutation();
  const [deleteCountry] = useDeleteCountryMutation();
  /* Model prop states */
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [dataId, setDataId] = useState<string>('');
  const [action, setAction] = useState<Action>(Action.None);
  /* Action states */
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  /* Ref for setting DataTable width */
  const containerWrapRef = useRef<HTMLDivElement>(null);
  /* Ref to call ActionMessage function */
  const actionMessagesRef = useRef<ActionMessagesRef>(null);
  /* Outlet context for searching */
  const { searchText } = useSearhText();
  /* Searched data from API */
  const [searchedData, setSearchedData] = useState<ICountry[]>([]);

  useEffect(() => {
    const filteredData = data?.data.filter((country: ICountry) => country.name.toLowerCase().includes(searchText));
    setSearchedData(filteredData || []);
  }, [searchText, data]);

  const resetState = () => {
    setName('');
    setCountryCode('');
    setDataId('');
    setIsFormOpen(false);
    setAction(Action.None);
    setShowDeleteModal(false);
  };

  const onDeleteClick = (id: string) => {
    setShowDeleteModal(true);
    setDataId(id);
  };

  const onUpdateClick = (id: string) => {
    const selectedRow = data?.data.find((country: ICountry) => country.id === id);
    setCountryCode(selectedRow?.countryCode || '');
    setName(selectedRow?.name || '');
    setDataId(selectedRow?.id || '');
    setIsFormOpen(true);
    setAction(Action.Update);
  };

  const onCreateClick = () => {
    setIsFormOpen(true);
    setAction(Action.Create);
  };

  /* API Calls */
  async function deleteRow() {
    setShowDeleteModal(false);
    await deleteCountry({ id: dataId })
      .unwrap()
      .then((dataDelete) => {
        actionMessagesRef.current!.createMessage(dataDelete.message, MessageType.Ok);
        refetch();
      })
      .catch((err) => {
        actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }
  const rows = getCountryRows(searchedData);
  const columns = getCountryColumns(onUpdateClick, onDeleteClick);

  async function updateRow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateCountry({ id: dataId, body: { name, countryCode } })
      .unwrap()
      .then((dataUpdate) => {
        const message = `[${dataUpdate.status}] Updated row with ID: ${dataUpdate.data.id}`;
        actionMessagesRef.current!.createMessage(message, MessageType.Ok);
        refetch();
        resetState();
      })
      .catch((err) => {
        actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  async function addRow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createCountry({ name, countryCode })
      .unwrap()
      .then((dataCreate) => {
        const message = `[${dataCreate.status}] Created new row with ID: ${dataCreate.data.id}`;
        actionMessagesRef.current!.createMessage(message, MessageType.Ok);
        refetch();
        resetState();
      })
      .catch((err) => {
        actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  return (
    <>
      <Loader show={isLoading || isFetching || isLoadingPost || isLoadingPut} />
      <Row className="crud-wrap flex-column gap-2 mt-4" ref={containerWrapRef}>
        <h3>Countries</h3>
        <hr />
        <Row className="actions-wrap flex-column gap-2 align-items-start">
          {isFormOpen && (
            <Animate>
              <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form">
                <Card.Body>
                  <Button
                    variant="danger"
                    type="submit"
                    className="text-danger bg-transparent border-0 position-absolute top-0 end-0 close-form-btn"
                    onClick={resetState}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} size="2xl" />
                  </Button>
                  <h5 className="mb-4">{action === Action.Create ? 'Add New Country' : `Update Row ID: ${dataId}`}</h5>
                  <Form onSubmit={action === Action.Create ? addRow : updateRow}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <TextField
                          required
                          className="w-100"
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                          label="Country name"
                          size="small"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <TextField
                          required
                          label="Country code"
                          className="w-100"
                          size="small"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row className="d-flex flex-row gap-3 justify-content-center ">
                      <Col lg={4}>
                        <Button variant="success" type="submit" className="w-100">
                          {action === Action.Create ? 'Create' : 'Update'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Animate>
          )}
          {!isFormOpen && (
            <Col xs={4} lg={2}>
              <Button variant="success" className="w-100" onClick={onCreateClick}>
                <FontAwesomeIcon icon={faPlus} size="xl" />
              </Button>
            </Col>
          )}
          <ActionMessages ref={actionMessagesRef} />
        </Row>
        <DataTable rows={rows} columns={columns} parentContainerRef={containerWrapRef} />
      </Row>
      <DeleteModalMessage showModal={showDeleteModal} id={dataId} resetState={resetState} doAction={deleteRow} />
    </>
  );
};

export default Countries;
