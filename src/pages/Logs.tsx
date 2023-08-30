import React, { useEffect, useRef, useState } from 'react';
import { Row } from 'react-bootstrap';
import { useSearhText } from 'components/layout/SidebarLayout';
import { getLogColumns, getLogRows } from 'components/data/DataTableConfigs';
import Loader from 'components/common/Loader';
import DataTable from 'components/data/DataTable';
import { ILogGetDTO } from 'types/log.types';
import { useGetLogsQuery } from 'api/log.api';

const Logs = () => {
  /* Redux API Hooks */
  const { data, isLoading, isFetching } = useGetLogsQuery(null);
  /* Ref for setting DataTable width */
  const containerWrapRef = useRef<HTMLDivElement>(null);
  /* Outlet context for searching */
  const { searchText } = useSearhText();
  /* Searched data from API */
  const [searchedData, setSearchedData] = useState<ILogGetDTO[]>([]);

  useEffect(() => {
    const filteredData = data?.data.filter(
      (log: ILogGetDTO) =>
        log.activityType.name.toLowerCase().includes(searchText) ||
        (log.user && log.user.email.toLowerCase().includes(searchText)) ||
        log.logMessage.toLowerCase().includes(searchText) ||
        log.ipAddress.toLowerCase().includes(searchText) ||
        log.endpoint.toLowerCase().includes(searchText) ||
        log.statusCode.toLowerCase().includes(searchText)
    );
    setSearchedData(filteredData || []);
  }, [searchText, data]);

  const rows = getLogRows(searchedData);
  const columns = getLogColumns();
  return (
    <>
      <Loader show={isLoading || isFetching} />
      <Row className="crud-wrap flex-column gap-2 mt-4" ref={containerWrapRef}>
        <h3>Log History</h3>
        <hr />
        <DataTable rows={rows} columns={columns} parentContainerRef={containerWrapRef} />
      </Row>
    </>
  );
};

export default Logs;
