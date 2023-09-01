/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useRef, useState } from 'react';
import { Row } from 'react-bootstrap';
import { useSearhText } from 'components/layout/SidebarLayout';
import { getAdminResidenceColumns, getResidenceRows } from 'components/data/DataTableConfigs';
import Loader from 'components/common/Loader';
import ActionMessages, { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import DataTable from 'components/data/DataTable';
import DeleteModalMessage from 'components/common/DeleteModalMessage';
import { useDeleteResidenceMutation, useGetResidenceesQuery, useUpdateResidenceMutation } from 'api/residence.api';
import { IResidence } from 'types/residence.types';
import { useDeleteByTypeAndIdMutation } from 'api/images.api';
import { useLocation } from 'react-router-dom';
import { useGetUsersQuery } from 'api/users.api';

const AdminResidences = () => {
  /* Redux API Hooks */
  const { data, isLoading, isFetching, refetch } = useGetResidenceesQuery(null);
  const { data: users, isLoading: isLoadingUsers, isFetching: isFetchingUsers } = useGetUsersQuery(null);
  const [updateResidence] = useUpdateResidenceMutation();
  const [deleteResidence] = useDeleteResidenceMutation();
  const [deleteImages] = useDeleteByTypeAndIdMutation();
  const [dataId, setDataId] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  /* Refs */
  const containerWrapRef = useRef<HTMLDivElement>(null);
  const actionMessagesRef = useRef<ActionMessagesRef>(null);
  /* Search */
  const { searchText } = useSearhText();
  const [searchedData, setSearchedData] = useState<IResidence[]>([]);
  /* Location */
  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    const filteredData = data?.data.filter((residence: IResidence) => residence.name.toLowerCase().includes(searchText));
    setSearchedData(filteredData || []);
  }, [searchText, data]);

  useEffect(() => {
    const fetchData = async () => {
      await refetch().then(() => {
        actionMessagesRef.current!.createMessage(`Residence ${state.newResidence} created !`, MessageType.Ok);
      });
    };
    if (state && state.newResidence) {
      fetchData();
    }
  }, [state]);

  const resetState = () => {
    setShowDeleteModal(false);
  };

  const onDeleteClick = (id: string) => {
    setShowDeleteModal(true);
    setDataId(id);
  };

  async function onPublishClick(rowId: string) {
    const residence = data?.data.find((r: IResidence) => r.id === rowId);
    const {
      id,
      name,
      description,
      isParkingFree,
      isWifiFree,
      isAirConFree,
      distanceBeach,
      distanceCenter,
      distanceSea,
      distanceStore,
    } = residence!;
    const owner = users?.data.find((u) => u.email === residence!.owner.email);
    console.log(owner);
    const updatedResidence = {
      id,
      name,
      description,
      isParkingFree,
      isWifiFree,
      isAirConFree,
      distanceBeach,
      distanceCenter,
      distanceSea,
      distanceStore,
      typeId: residence!.type.id,
      ownerId: owner!.id,
      isPublished: !residence?.isPublished,
    };
    console.log(updatedResidence);
    await updateResidence(updatedResidence)
      .unwrap()
      .then((dataUpdate) => {
        const message = `[${dataUpdate.status}] Residence ${residence!.name} is now ${updatedResidence.isPublished}`;
        refetch();
        actionMessagesRef.current!.createMessage(message, MessageType.Ok);
      })
      .catch((err) => {
        actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  /* API Calls */
  async function deleteRow() {
    setShowDeleteModal(false);
    try {
      await deleteImages({ type: 'residence', id: dataId })
        .unwrap()
        .then(() => {
          actionMessagesRef.current!.createMessage('Images deleted!', MessageType.Ok);
          deleteResidence({ id: dataId })
            .unwrap()
            .then(() => {
              actionMessagesRef.current!.createMessage('Residence deleted!', MessageType.Ok);
              refetch();
            })
            .catch((err) => {
              actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
            });
        })
        .catch((err) => {
          actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
        });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  const rows = getResidenceRows(searchedData);
  const columns = getAdminResidenceColumns(onDeleteClick, onPublishClick);

  return (
    <>
      <Loader show={isLoading || isFetching || isLoadingUsers || isFetchingUsers} />
      <Row className="crud-wrap flex-column gap-2 mt-4" ref={containerWrapRef}>
        <h3>My Residences</h3>
        <hr />
        <Row className="actions-wrap flex-column gap-2 align-items-start">
          <ActionMessages ref={actionMessagesRef} />
        </Row>
        <DataTable rows={rows} columns={columns} parentContainerRef={containerWrapRef} />
      </Row>
      <DeleteModalMessage showModal={showDeleteModal} id={dataId} resetState={resetState} doAction={deleteRow} />
    </>
  );
};

export default AdminResidences;
