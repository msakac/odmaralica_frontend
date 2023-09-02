import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useSearhText } from 'components/layout/SidebarLayout';
import { getUserColumns, getUserRows } from 'components/data/DataTableConfigs';
import Animate from 'components/common/Animate';
import Loader from 'components/common/Loader';
import ActionMessages, { Action, ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import DataTable from 'components/data/DataTable';
import DeleteModalMessage from 'components/common/DeleteModalMessage';
import { IUser } from 'types/users.types';
import { useCreateUserMutation, useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from 'api/users.api';
import { useGetRolesQuery } from 'api/roles.api';
import { IRole } from 'types/role.types';
import Dropdown from 'components/common/Dropdown';
import Input from 'components/common/Input';
import CustomCheckbox from 'components/common/CustomCheckbox';

const Users = () => {
  /* Redux API Hooks */
  const { data, isLoading, isFetching, refetch } = useGetUsersQuery(null);
  const { data: roles } = useGetRolesQuery(null);
  const [create, { isLoading: isLoadingPost }] = useCreateUserMutation();
  const [update, { isLoading: isLoadingPut }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  /* Model prop states */
  const [dataId, setDataId] = useState<string>('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activated, setActivated] = useState(false);
  const [role, setRole] = useState('');
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
  const [searchedData, setSearchedData] = useState<IUser[]>([]);

  useEffect(() => {
    const filteredData = data?.data.filter(
      (user: IUser) =>
        user.name.toLowerCase().includes(searchText) ||
        user.surname.toLowerCase().includes(searchText) ||
        user.role.role.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText)
    );
    setSearchedData(filteredData || []);
  }, [searchText, data]);

  const resetState = () => {
    setName('');
    setSurname('');
    setEmail('');
    setPassword('');
    setRole('');
    setDataId('');
    setActivated(false);
    setIsFormOpen(false);
    setAction(Action.None);
    setShowDeleteModal(false);
  };

  const onDeleteClick = (id: string) => {
    setShowDeleteModal(true);
    setDataId(id);
  };

  const onUpdateClick = (id: string) => {
    const selectedRow = data?.data.find((row: IUser) => row.id === id);
    setSurname(selectedRow?.surname || '');
    setEmail(selectedRow?.email || '');
    setPassword(selectedRow?.password || '');
    setRole(selectedRow?.role.id || '');
    setName(selectedRow?.name || '');
    setDataId(selectedRow?.id || '');
    setActivated(selectedRow?.activated || false);
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
    const updatedUser = data?.data.find((user: IUser) => user.id === dataId);
    const updatedFields = {
      ...updatedUser,
      id: dataId.toString(),
      name,
      surname,
      email,
      password,
      activated,
      role: roles!.data.find((r: IRole) => r.id === role) as IRole,
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
    await create({ name, surname, email, password, roleId: role, activated })
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

  const rows = getUserRows(searchedData);
  const columns = getUserColumns(onUpdateClick, onDeleteClick);
  const dropdownOptions = roles?.data.map((r: IRole) => {
    return { id: r.id, name: r.role };
  });

  return (
    <>
      <Loader show={isLoading || isFetching || isLoadingPost || isLoadingPut} />
      <Row className="crud-wrap flex-column gap-2 mt-4" ref={containerWrapRef}>
        <h3>Users</h3>
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
                    <Row className="gap-4">
                      <Row>
                        <Col md={6} className="mb-3">
                          <Input value={name} setValue={setName} label="Name" />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Input value={surname} setValue={setSurname} label="Surname" />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Input value={email} setValue={setEmail} label="Email" />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Input value={password} setValue={setPassword} label="Password" type="password" />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-3">
                          <CustomCheckbox value={activated} setValue={setActivated} label="Activated" />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Dropdown value={role} setValue={setRole} label="Role" options={dropdownOptions} />
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

export default Users;
