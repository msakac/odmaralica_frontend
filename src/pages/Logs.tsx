import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useSearhText } from 'components/layout/SidebarLayout';
import { getLogColumns, getLogRows } from 'components/data/DataTableConfigs';
import Loader from 'components/common/Loader';
import DataTable from 'components/data/DataTable';
import { ILogEncryptedGetDTO } from 'types/log.types';
import { useGetEncryptedLogsQuery } from 'api/log.api';
import decryptLogData from 'utils/decryptLogData';
import ActionMessages, { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import Input from 'components/common/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Logs = () => {
  /* Redux API Hooks */
  const { data, isLoading, isFetching } = useGetEncryptedLogsQuery(null);
  /* Ref for setting DataTable width */
  const containerWrapRef = useRef<HTMLDivElement>(null);
  /* Outlet context for searching */
  const { searchText } = useSearhText();
  /* Searched data from API */
  const [searchedData, setSearchedData] = useState<ILogEncryptedGetDTO[]>([]);
  const [decryptKey, setDecryptKey] = useState<string>('');
  const actionMessagesRef = useRef<ActionMessagesRef>(null);

  useEffect(() => {
    const filteredData = data?.data.filter(
      (log: ILogEncryptedGetDTO) =>
        log.activityType.toLowerCase().includes(searchText) ||
        log.user.toLowerCase().includes(searchText) ||
        log.logMessage.toLowerCase().includes(searchText) ||
        log.ipAddress.toLowerCase().includes(searchText) ||
        log.endpoint.toLowerCase().includes(searchText) ||
        log.statusCode.toLowerCase().includes(searchText)
    );
    setSearchedData(filteredData || []);
  }, [searchText, data]);

  // Decrypt each object in the encrypted list
  const decryptData = () => {
    const decryptedList = data?.data.map((encryptedLogEntry) => {
      return decryptLogData(encryptedLogEntry, decryptKey);
    });
    if (decryptedList === undefined || decryptedList.length === 0 || decryptedList.some((obj) => obj === null)) {
      actionMessagesRef.current!.createMessage('Error while decrypting data', MessageType.Error);
      return;
    }
    setSearchedData(decryptedList as ILogEncryptedGetDTO[]);
  };

  const rows = getLogRows(searchedData);
  const columns = getLogColumns();
  return (
    <>
      <Loader show={isLoading || isFetching} />

      <Row className="crud-wrap flex-column gap-2 mt-4" ref={containerWrapRef}>
        <h3>Log History</h3>
        <hr />
        <ActionMessages ref={actionMessagesRef} />
        <Row className="gap-2 gap-lg-0">
          <Col xs={12} lg={4}>
            <Input type="text" label="Secret" value={decryptKey} setValue={setDecryptKey} />
          </Col>
          <Col xs={12} lg={4}>
            <Row>
              {decryptKey && (
                <Col xs={3}>
                  <Button variant="danger" className="w-100" disabled={!decryptKey} onClick={() => setDecryptKey('')}>
                    <FontAwesomeIcon icon={faTimes} className="" size="lg" />
                  </Button>
                </Col>
              )}
              <Col xs={decryptKey ? 9 : 12}>
                <Button variant="success" className="px-4 w-100" disabled={!decryptKey} onClick={decryptData}>
                  Decrypt
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <DataTable rows={rows} columns={columns} parentContainerRef={containerWrapRef} />
      </Row>
    </>
  );
};

export default Logs;
