/* eslint-disable no-unused-vars */
import React from 'react';
import { faBan, faPenToSquare, faTrash, faUpload, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { GridColDef } from '@mui/x-data-grid';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICountry } from 'types/country.types';
import { ILogEncryptedGetDTO, ILogGetDTO } from 'types/log.types';
import { formatDate } from 'utils';
import { IUser } from 'types/users.types';
import { ICity } from 'types/city.types';
import { IRegion } from 'types/region.types';
import { IResidenceGetDTO } from 'types/residence.types';
import routes from 'routes/routes';
import { encryptData } from 'utils/urlSafety';
import { IAccommodationUnitGetDTO } from 'types/accommodationUnit.types';
import formatDateToTimestamp from 'utils/formatDateToTimestamp';
import parseFormattedDate from 'utils/parseFormatedDate';
import compareDates from 'utils/compareDates';
import compareNumbers from 'utils/compareNumbers';
import { IPricePeriod } from 'types/pricePeriod.types';
import { IReservationGetDTO } from 'types/reservation.types';
import dayjs from 'dayjs';
import getReservationStatus from 'utils/getReservationStatus';
import getStatusClassName from 'utils/getStatusClassName';
import { IPrivacyRequestGetDTO } from 'types/privacyRequest.types';

/* Country */
export const getCountryColumns = (
  onUpdateClick: (id: string) => void,
  onDeleteClick: (id: string) => void
): GridColDef[] => {
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Country Name', width: 250 },
    { field: 'countryCode', headerName: 'CountryCode', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <Button variant="primary" onClick={() => onUpdateClick(params.row.id)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button variant="danger" className="mx-3" onClick={() => onDeleteClick(params.row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      ),
    },
  ];
};

export const getCountryRows = (data: ICountry[]) =>
  data?.map((country: ICountry) => {
    return {
      id: country.id,
      name: country.name,
      countryCode: country.countryCode,
    };
  }) || [];

/* Log */
export const getLogRows = (data: ILogEncryptedGetDTO[]) =>
  data?.map((log: ILogEncryptedGetDTO) => {
    return {
      id: log.id,
      user: log.user,
      activityType: log.activityType,
      logMessage: log.logMessage,
      createdAt: formatDate(log.createdAt),
      httpMethod: log.httpMethod,
      endpoint: log.endpoint,
      statusCode: log.statusCode,
      ipAddress: log.ipAddress,
      responseTime: log.responseTime,
    };
  }) || [];

export const getLogColumns = (): GridColDef[] => {
  return [
    { field: 'activityType', headerName: 'Type', width: 150 },
    { field: 'user', headerName: 'User', width: 150 },
    { field: 'ipAddress', headerName: 'IP Address', width: 120 },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 200,
      sortComparator: compareDates,
    },
    { field: 'endpoint', headerName: 'Endpoint', width: 150 },
    { field: 'httpMethod', headerName: 'Method', width: 80 },
    { field: 'statusCode', headerName: 'Status', width: 150 },
    { field: 'responseTime', headerName: 'Response', width: 90, sortComparator: compareNumbers },
    { field: 'logMessage', headerName: 'Message', width: 400 },
  ];
};

/* User */
export const getUserColumns = (onUpdateClick: (id: string) => void, onDeleteClick: (id: string) => void): GridColDef[] => {
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 120 },
    { field: 'surname', headerName: 'Surname', width: 120 },
    { field: 'email', headerName: 'E-mail', width: 250 },
    { field: 'password', headerName: 'Password', width: 70 },
    { field: 'role', headerName: 'Role', width: 100 },
    { field: 'activated', headerName: 'Activated', width: 70 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <Button variant="primary" onClick={() => onUpdateClick(params.row.id)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button variant="danger" className="mx-3" onClick={() => onDeleteClick(params.row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      ),
    },
  ];
};

export const getUserRows = (data: IUser[]) =>
  data?.map((user: IUser) => {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
      role: (user.role && user.role.role) || '',
      activated: user.activated ? 'Yes' : 'No',
    };
  }) || [];

/* City */
export const getCityColumns = (onUpdateClick: (id: string) => void, onDeleteClick: (id: string) => void): GridColDef[] => {
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'City Name', width: 250 },
    { field: 'zip', headerName: 'ZIP', width: 100 },
    { field: 'region', headerName: 'Region', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <Button variant="primary" onClick={() => onUpdateClick(params.row.id)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button variant="danger" className="mx-3" onClick={() => onDeleteClick(params.row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      ),
    },
  ];
};

export const getCityRows = (data: ICity[]) =>
  data?.map((city: ICity) => {
    return {
      id: city.id,
      name: city.name,
      zip: city.zip,
      region: city.region.name,
    };
  }) || [];

/* Region */
export const getRegionColumns = (onUpdateClick: (id: string) => void, onDeleteClick: (id: string) => void): GridColDef[] => {
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Region', width: 250 },
    { field: 'country', headerName: 'Country', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <Button variant="primary" onClick={() => onUpdateClick(params.row.id)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button variant="danger" className="mx-3" onClick={() => onDeleteClick(params.row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      ),
    },
  ];
};

export const getRegionRows = (data: IRegion[]) =>
  data?.map((row: IRegion) => {
    return {
      id: row.id,
      name: row.name,
      country: row.country.name,
    };
  }) || [];

/* Residence */
export const getResidenceRows = (data: IResidenceGetDTO[]) =>
  data?.map((row: IResidenceGetDTO) => {
    return {
      id: row.id,
      name: row.name,
      type: row.type.name,
      isPublished: row.isPublished ? 'Yes' : 'No',
    };
  }) || [];

export const getResidenceColumns = (onDeleteClick: (id: string) => void): GridColDef[] => {
  return [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'type', headerName: 'Residence Type', width: 250 },
    { field: 'isPublished', headerName: 'Is published', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="primary"
            href={routes.EditResidence.absolutePath.replace(':id', encodeURIComponent(encryptData(params.row.id)))}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button className="mx-3" variant="danger" onClick={() => onDeleteClick(params.row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      ),
    },
  ];
};

export const getAdminResidenceColumns = (
  onDeleteClick: (id: string) => void,
  onPublishClick: (id: string) => void
): GridColDef[] => {
  return [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'type', headerName: 'Residence Type', width: 250 },
    { field: 'isPublished', headerName: 'Is published', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="primary"
            href={routes.EditResidence.absolutePath.replace(':id', encodeURIComponent(encryptData(params.row.id)))}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button className="mx-3" variant="danger" onClick={() => onDeleteClick(params.row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          <Button
            variant={params.row.isPublished === 'Yes' ? 'warning' : 'success'}
            onClick={() => onPublishClick(params.row.id)}
          >
            <FontAwesomeIcon icon={faUpload} rotation={params.row.isPublished === 'Yes' ? 180 : undefined} />
          </Button>
        </>
      ),
    },
  ];
};

/* Accommodation Unit */
export const getAccommodationUnitRows = (data: IAccommodationUnitGetDTO[]) =>
  data?.map((row: IAccommodationUnitGetDTO) => {
    return {
      id: row.id,
      name: row.name,
      residenceId: row.residence.id,
    };
  }) || [];

export const getAccommodationUnitColumns = (
  onUpdateClick: (id: string) => void,
  onDeleteClick: (id: string) => void
): GridColDef[] => {
  return [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button variant="primary" onClick={() => onUpdateClick(params.row.id)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button className="mx-3" variant="danger" onClick={() => onDeleteClick(params.row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      ),
    },
  ];
};

/* Price Period */

export const getPricePeriodColumns = (
  onUpdateClick: (id: string) => void,
  onDeleteClick: (id: string) => void
): GridColDef[] => {
  return [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'startAt', headerName: 'Start At', width: 200 },
    { field: 'endAt', headerName: 'End At', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'currency', headerName: 'Currency', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <Button variant="primary" onClick={() => onUpdateClick(params.row.id)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button variant="danger" className="mx-3" onClick={() => onDeleteClick(params.row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      ),
    },
  ];
};

export const getPricePeriodRows = (data: IPricePeriod[]) =>
  data?.map((p: IPricePeriod) => {
    return {
      id: p.id,
      startAt: p.startAt,
      endAt: p.endAt,
      amount: p.amount.amount,
      currency: p.amount.currency,
    };
  }) || [];

/* Reservation */
export const getReservationRows = (data: IReservationGetDTO[]) =>
  data?.map((r: IReservationGetDTO) => {
    return {
      id: r.id,
      user: `${r.user.name} ${r.user.surname}`,
      startAt: dayjs(r.startAt).format('DD.MM.YYYY'),
      endAt: dayjs(r.endAt).format('DD.MM.YYYY'),
      note: r.note,
      status: getReservationStatus(r),
      createdAt: dayjs(r.createdAt).format('DD.MM.YYYY'),
    };
  }) || [];

export const getReservationColumns = (onCancelClick: (id: string) => void): GridColDef[] => {
  return [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'user', headerName: 'Guest', width: 150 },
    { field: 'startAt', headerName: 'Check-In', width: 120, sortComparator: compareDates },
    { field: 'endAt', headerName: 'Check-Out', width: 120, sortComparator: compareDates },
    { field: 'note', headerName: 'Note', width: 150 },
    { field: 'status', headerName: 'Status', width: 150, cellClassName: (params) => getStatusClassName(params.value) },
    { field: 'createdAt', headerName: 'Created at', width: 150, sortComparator: compareDates },
    {
      field: 'actions',
      headerName: 'Cancel',
      width: 120,
      renderCell: (params) => {
        const { status } = params.row;

        // Conditionally render the button based on the status
        if (status === 'Upcoming') {
          return (
            <Button variant="danger" className="mx-3" onClick={() => onCancelClick(params.row.id)}>
              <FontAwesomeIcon icon={faBan} />
            </Button>
          );
        }
        return null;
      },
    },
  ];
};

/* Reservation */
export const getPrivacyRequestRows = (data: IPrivacyRequestGetDTO[]) =>
  data?.map((r: IPrivacyRequestGetDTO) => {
    return {
      id: r.id,
      user: `${r.user.name} ${r.user.surname}`,
      reason: r.reason,
      revoked: r.revoked ? 'Yes' : 'No',
      accepted: r.accepted ? 'Yes' : 'No',
      acceptedBy: r.acceptedBy ? `${r.acceptedBy.name} ${r.acceptedBy.surname}` : '',
      createdAt: dayjs(r.createdAt).format('DD.MM.YYYY'),
    };
  }) || [];

export const getPrivacyRequestColumns = (onCancelClick: (id: string) => void): GridColDef[] => {
  return [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'user', headerName: 'User', width: 150 },
    { field: 'reason', headerName: 'Reason', width: 200 },
    { field: 'revoked', headerName: 'Revoked', width: 100 },
    { field: 'accepted', headerName: 'Accepted', width: 100 },
    { field: 'acceptedBy', headerName: 'Accepted By', width: 150 },
    { field: 'createdAt', headerName: 'Created at', width: 150, sortComparator: compareDates },
    {
      field: 'actions',
      headerName: 'Accept',
      width: 120,
      renderCell: (params) => {
        const { accepted, revoked } = params.row;

        // Conditionally render the button based on the status
        if (accepted === 'No' && revoked === 'No') {
          return (
            <Button variant="danger" className="mx-3" onClick={() => onCancelClick(params.row.id)}>
              <FontAwesomeIcon icon={faUserSlash} />
            </Button>
          );
        }
        return null;
      },
    },
  ];
};
