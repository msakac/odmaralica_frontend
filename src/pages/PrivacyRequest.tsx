/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useRef, useState } from 'react';
import { Row } from 'react-bootstrap';
import { useSearhText } from 'components/layout/SidebarLayout';
import { getPrivacyRequestColumns, getPrivacyRequestRows } from 'components/data/DataTableConfigs';
import Loader from 'components/common/Loader';
import ActionMessages, { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import DataTable from 'components/data/DataTable';
import DeleteModalMessage from 'components/common/DeleteModalMessage';
import { useGetPrivacyRequestsQuery, useUpdateAcceptPrivacyRequestMutation } from 'api/privacyRequest.api';
import { IPrivacyRequestGetDTO } from 'types/privacyRequest.types';

const PrivacyRequest = () => {
  const { data, isLoading, isFetching, refetch } = useGetPrivacyRequestsQuery(null);
  const [acceptPrivacyRequest, { isLoading: isLoadingPrivacyRequest }] = useUpdateAcceptPrivacyRequestMutation();
  const [dataId, setDataId] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const containerWrapRef = useRef<HTMLDivElement>(null);
  const actionMessagesRef = useRef<ActionMessagesRef>(null);
  const { searchText } = useSearhText();
  const [searchedData, setSearchedData] = useState<IPrivacyRequestGetDTO[]>([]);

  useEffect(() => {
    const filteredData = data?.data.filter(
      (privacy: IPrivacyRequestGetDTO) =>
        privacy.user.name.toLowerCase().includes(searchText) ||
        privacy.user.surname.toLowerCase().includes(searchText) ||
        privacy.acceptedBy.name.toLowerCase().includes(searchText) ||
        privacy.acceptedBy.surname.toLowerCase().includes(searchText)
    );
    setSearchedData(filteredData || []);
  }, [searchText, data]);

  const resetState = () => {
    setShowDeleteModal(false);
  };

  const onClickOpenModal = (id: string) => {
    setDataId(id);
    setShowDeleteModal(true);
  };

  async function acceptRequest() {
    await acceptPrivacyRequest({ id: dataId })
      .unwrap()
      .then((data) => {
        const message = `[${data.status}] Data for User ID: ${dataId} has been cleared!`;
        actionMessagesRef.current!.createMessage(message, MessageType.Ok);
        refetch();
        setShowDeleteModal(false);
      })
      .catch((error) => {
        actionMessagesRef.current!.createMessage(error, MessageType.Error);
      });
  }

  const rows = getPrivacyRequestRows(searchedData);
  const columns = getPrivacyRequestColumns(onClickOpenModal);

  return (
    <>
      <Loader show={isLoading || isFetching || isLoadingPrivacyRequest} />
      <Row className="crud-wrap flex-column gap-2 mt-4" ref={containerWrapRef}>
        <h3>Privacy Requests</h3>
        <hr />
        <Row className="actions-wrap flex-column gap-2 align-items-start">
          <ActionMessages ref={actionMessagesRef} />
        </Row>
        <DataTable rows={rows} columns={columns} parentContainerRef={containerWrapRef} />
      </Row>
      <DeleteModalMessage showModal={showDeleteModal} id={dataId} resetState={resetState} doAction={acceptRequest} />
    </>
  );
};

export default PrivacyRequest;
