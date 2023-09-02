import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useSearhText } from 'components/layout/SidebarLayout';
import { getCityColumns, getCityRows } from 'components/data/DataTableConfigs';
import Animate from 'components/common/Animate';
import Loader from 'components/common/Loader';
import ActionMessages, { Action, ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import DataTable from 'components/data/DataTable';
import DeleteModalMessage from 'components/common/DeleteModalMessage';
import Dropdown from 'components/common/Dropdown';
import Input from 'components/common/Input';
import { useCreateCityMutation, useDeleteCityMutation, useGetCitiesQuery, useUpdateCityMutation } from 'api/city.api';
import { useGetRegionsQuery } from 'api/region.api';
import { ICity } from 'types/city.types';
import { IRegion } from 'types/region.types';

const Cities = () => {
  /* Redux API Hooks */
  const { data, isLoading, isFetching, refetch } = useGetCitiesQuery(null);
  const { data: regions } = useGetRegionsQuery(null);
  const [create, { isLoading: isLoadingPost }] = useCreateCityMutation();
  const [update, { isLoading: isLoadingPut }] = useUpdateCityMutation();
  const [deleteUser] = useDeleteCityMutation();
  /* Model prop states */
  const [dataId, setDataId] = useState<string>('');
  const [name, setName] = useState('');
  const [zip, setZip] = useState('');
  const [region, setRegion] = useState('');
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
  const [searchedData, setSearchedData] = useState<ICity[]>([]);

  useEffect(() => {
    const filteredData = data?.data.filter(
      (c: ICity) =>
        c.name.toLowerCase().includes(searchText) ||
        c.zip.includes(searchText) ||
        c.region.name.toLowerCase().includes(searchText)
    );
    setSearchedData(filteredData || []);
  }, [searchText, data]);

  const resetState = () => {
    setName('');
    setDataId('');
    setRegion('');
    setZip('');
    setIsFormOpen(false);
    setAction(Action.None);
    setShowDeleteModal(false);
  };

  const onDeleteClick = (id: string) => {
    setShowDeleteModal(true);
    setDataId(id);
  };

  const onUpdateClick = (id: string) => {
    const selectedRow = data?.data.find((row: ICity) => row.id === id);
    setName(selectedRow?.name || '');
    setDataId(selectedRow?.id || '');
    setRegion(selectedRow?.region.id || '');
    setZip(selectedRow?.zip || '');
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
    await deleteUser({ id: dataId })
      .unwrap()
      .then((dataDelete) => {
        actionMessagesRef.current!.createMessage(dataDelete.message, MessageType.Ok);
        refetch();
      })
      .catch((err) => {
        actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  async function updateRow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedFields = {
      id: dataId.toString(),
      name,
      zip,
      regionId: region,
    };
    await update(updatedFields)
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
    await create({ name, zip, regionId: region })
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

  const rows = getCityRows(searchedData);
  const columns = getCityColumns(onUpdateClick, onDeleteClick);
  const dropdownOptions = regions?.data.map((r: IRegion) => {
    return { id: r.id, name: r.name };
  });

  return (
    <>
      <Loader show={isLoading || isFetching || isLoadingPost || isLoadingPut} />
      <Row className="crud-wrap flex-column gap-2 mt-4" ref={containerWrapRef}>
        <h3>Cities</h3>
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
                  <h5 className="mb-4">{action === Action.Create ? 'Add New City' : `Update Row ID: ${dataId}`}</h5>
                  <Form onSubmit={action === Action.Create ? addRow : updateRow}>
                    <Row className="gap-4">
                      <Row>
                        <Col md={6} className="mb-3">
                          <Input value={name} setValue={setName} label="Name" />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Input value={zip} setValue={setZip} label="ZIP" type="number" />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Dropdown value={region} setValue={setRegion} label="Region" options={dropdownOptions} />{' '}
                        </Col>
                      </Row>
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

export default Cities;
