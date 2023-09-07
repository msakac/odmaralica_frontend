/* eslint-disable no-shadow */
import React, { useEffect, useRef, useState } from 'react';
import { Row } from 'react-bootstrap';
import { useSearhText } from 'components/layout/SidebarLayout';
import { getReservationColumns, getReservationRows } from 'components/data/DataTableConfigs';
import Loader from 'components/common/Loader';
import DataTable from 'components/data/DataTable';
import { IAccommodationUnitGetDTO } from 'types/accommodationUnit.types';
import { IReservationGetDTO } from 'types/reservation.types';
import { useFindReservationsQuery, useUpdateReservationMutation } from 'api/reservation.api';
import ActionMessages, { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';

interface ITabsReservationsProps {
  accommodationUnit: IAccommodationUnitGetDTO;
}

const TabReservations = ({ accommodationUnit }: ITabsReservationsProps) => {
  /* Redux API Hooks */
  const { data, isLoading, isFetching, refetch } = useFindReservationsQuery({
    q: `accommodationUnit.id=${accommodationUnit.id}`,
  });
  const [updateReservation, { isLoading: isLoadingUpdate }] = useUpdateReservationMutation();
  /* Ref for setting DataTable width */
  const containerWrapRef = useRef<HTMLDivElement>(null);
  /* Outlet context for searching */
  const { searchText } = useSearhText();
  const actionMessagesRef = useRef<ActionMessagesRef>(null);
  /* Searched data from API */
  const [searchedData, setSearchedData] = useState<IReservationGetDTO[]>([]);

  useEffect(() => {
    const filteredData = data?.data.filter(
      (r: IReservationGetDTO) =>
        r.user.name.toLowerCase().includes(searchText) || r.user.surname.toLowerCase().includes(searchText)
    );
    setSearchedData(filteredData || []);
  }, [searchText, data]);

  async function updateRow(id: string) {
    const reservation = data?.data.find((r: IReservationGetDTO) => r.id === id);
    const { accommodationUnit, user, cancelled, ...otherData } = reservation!;
    await updateReservation({
      ...otherData,
      cancelled: !cancelled,
      accommodationUnitId: accommodationUnit.id,
      userEmail: user.email,
    })
      .unwrap()
      .then((dataUpdate) => {
        const message = `[${dataUpdate.status}] Cancelled reservation ID ${dataUpdate.data.id}`;
        actionMessagesRef.current!.createMessage(message, MessageType.Ok);
        refetch();
      })
      .catch((err) => {
        actionMessagesRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  const rows = getReservationRows(searchedData);
  const columns = getReservationColumns(updateRow);
  return (
    <>
      <Loader show={isLoading || isFetching || isLoadingUpdate} />
      <Row className="crud-wrap flex-column gap-2 mt-4" ref={containerWrapRef}>
        <h3>Reservations</h3>
        <hr />
        <ActionMessages ref={actionMessagesRef} />
        <DataTable rows={rows} columns={columns} parentContainerRef={containerWrapRef} />
      </Row>
    </>
  );
};

export default TabReservations;
