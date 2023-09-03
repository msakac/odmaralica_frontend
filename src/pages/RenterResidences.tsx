/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useRef, useState } from 'react';
import { Row } from 'react-bootstrap';
import { useSearhText } from 'components/layout/SidebarLayout';
import { getResidenceColumns, getResidenceRows } from 'components/data/DataTableConfigs';
import Loader from 'components/common/Loader';
import ActionMessages, { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import DataTable from 'components/data/DataTable';
import DeleteModalMessage from 'components/common/DeleteModalMessage';
import { useDeleteResidenceMutation, useFindResidenceQuery } from 'api/residence.api';
import { selectAuthentication } from 'app/store';
import { useSelector } from 'react-redux';
import { IResidenceGetDTO } from 'types/residence.types';
import { useDeleteByTypeAndIdMutation } from 'api/images.api';
import { useLocation } from 'react-router-dom';

/* TODO: Dodati ownera na tablicu */

const RenterResidences = () => {
  const { user } = useSelector(selectAuthentication);
  /* Redux API Hooks */
  const { data, isLoading, isFetching, refetch } = useFindResidenceQuery({ q: `owner.id=${user!.id}` });
  const [deleteResidence] = useDeleteResidenceMutation();
  const [deleteImages] = useDeleteByTypeAndIdMutation();
  const [dataId, setDataId] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  /* Refs */
  const containerWrapRef = useRef<HTMLDivElement>(null);
  const actionMessagesRef = useRef<ActionMessagesRef>(null);
  /* Search */
  const { searchText } = useSearhText();
  const [searchedData, setSearchedData] = useState<IResidenceGetDTO[]>([]);
  /* Location */
  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    const filteredData = data?.data.filter((residence: IResidenceGetDTO) =>
      residence.name.toLowerCase().includes(searchText)
    );
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
  const columns = getResidenceColumns(onDeleteClick);

  return (
    <>
      <Loader show={isLoading || isFetching} />
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

export default RenterResidences;
