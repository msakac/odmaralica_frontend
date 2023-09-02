/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Row } from 'react-bootstrap';
import { getAccommodationUnitColumns, getAccommodationUnitRows } from 'components/data/DataTableConfigs';
import { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import DataTable from 'components/data/DataTable';
import DeleteModalMessage from 'components/common/DeleteModalMessage';
import { IAccommodationUnitGetDTO, IAccommodationUnitOmited } from 'types/accommodationUnit.types';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryDefinition } from '@reduxjs/toolkit/dist/query';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import IResponse from 'types/IResponse';
import { useCreateAccommodationUnitMutation, useDeleteAccommodationUnitMutation } from 'api/accommodationUnit.api';
import AccommodationUnitForm from 'components/residence/accommodationUnit/AccommodationUnitForm';
import Loader from 'components/common/Loader';

interface ITabAccommodationUnitsProps {
  data: IAccommodationUnitGetDTO[];
  searchText: string;
  actionMessagesRef: RefObject<ActionMessagesRef>;
  residenceId: string;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      {
        q: string;
      },
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      IResponse<IAccommodationUnitGetDTO[]>,
      'rootApi'
    >
  >;
  onEditAccUnitClick: (id: string) => void;
}

const TabAccommodationUnits = ({
  data,
  searchText,
  actionMessagesRef,
  refetch,
  residenceId,
  onEditAccUnitClick,
}: ITabAccommodationUnitsProps) => {
  /* Redux API Hooks */
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [createAccommodationUnit, { isLoading }] = useCreateAccommodationUnitMutation();
  const [accUnitData, setAccUnitData] = useState<IAccommodationUnitOmited>({
    name: '',
    description: '',
    unitSize: '',
    numOfGuests: '',
    beds: '',
    privateKitchen: false,
    privateBathroom: false,
    terrace: false,
    seaView: false,
    tv: false,
    pets: false,
    smoking: false,
  });

  const [deleteAccommodationUnit] = useDeleteAccommodationUnitMutation();
  /* Refs */
  const containerWrapRef = useRef<HTMLDivElement>(null);
  const [dataId, setDataId] = useState<string>('');
  /* Search */
  const [searchedData, setSearchedData] = useState<IAccommodationUnitGetDTO[]>([]);
  useEffect(() => {
    const filteredData = data?.filter((acc: IAccommodationUnitGetDTO) => acc.name.toLowerCase().includes(searchText));
    setSearchedData(filteredData || []);
  }, [searchText, data]);

  async function addAccommodationUnit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createAccommodationUnit({ ...accUnitData, residenceId })
      .unwrap()
      .then((res) => {
        const message = `[${res.status}] Created Accommodation Unit: ${res.data.name}`;
        refetch();
        actionMessagesRef.current!.createMessage(message, MessageType.Ok);
      })
      .catch((err) => {
        console.log('Err:', err);
        actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  const onDeleteClick = (id: string) => {
    setShowDeleteModal(true);
    setDataId(id);
  };

  /* API Calls */
  async function deleteRow() {
    setShowDeleteModal(false);
    try {
      await deleteAccommodationUnit({ id: dataId })
        .unwrap()
        .then(() => {
          refetch();
          actionMessagesRef.current!.createMessage('Accommodation unit deleted!', MessageType.Ok);
        })
        .catch((err) => {
          actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
        });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  const rows = getAccommodationUnitRows(searchedData);
  const columns = getAccommodationUnitColumns(onEditAccUnitClick, onDeleteClick);

  return (
    <>
      <Loader show={isLoading} />
      <Row className="crud-wrap flex-column gap-2 mt-4" ref={containerWrapRef}>
        <h5>Accommodation units</h5>
        <hr />
        <Row className="accommodation-unit-wrap">
          <DataTable rows={rows} columns={columns} parentContainerRef={containerWrapRef} />
          <AccommodationUnitForm
            data={accUnitData}
            setData={setAccUnitData}
            onSubmit={addAccommodationUnit}
            buttonText="Create"
          />
        </Row>
      </Row>
      <DeleteModalMessage
        showModal={showDeleteModal}
        id={dataId}
        resetState={() => setShowDeleteModal(false)}
        doAction={deleteRow}
      />
    </>
  );
};

export default TabAccommodationUnits;
