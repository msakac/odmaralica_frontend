/* eslint-disable no-unused-vars */
import React from 'react';
import { faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import { GridColDef } from '@mui/x-data-grid';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICountry } from 'types/address.types';
import { ILogGetDTO } from 'types/log.types';
import { formatDate } from 'utils';

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
            <FontAwesomeIcon icon={faGear} />
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
export const getLogRows = (data: ILogGetDTO[]) =>
  data?.map((log: ILogGetDTO) => {
    console.log();
    return {
      id: log.id,
      user: (log.user && log.user.email) || '',
      activityType: log.activityType.name,
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
    { field: 'createdAt', headerName: 'Created at', width: 200 },
    { field: 'endpoint', headerName: 'Endpoint', width: 150 },
    { field: 'httpMethod', headerName: 'Method', width: 80 },
    { field: 'statusCode', headerName: 'Status', width: 150 },
    { field: 'responseTime', headerName: 'Response', width: 90 },
    { field: 'logMessage', headerName: 'Message', width: 400 },
  ];
};
