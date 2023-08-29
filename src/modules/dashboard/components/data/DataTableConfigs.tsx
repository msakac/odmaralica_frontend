/* eslint-disable no-unused-vars */
import React from 'react';
import { faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import { GridColDef } from '@mui/x-data-grid';
import { ICountry } from 'modules/address/address.types';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IResponse from 'Common/definitions/IResponse';

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

export const getCountryRows = (data: IResponse<ICountry[]>) =>
  data?.data.map((country: ICountry) => {
    return {
      id: country.id,
      name: country.name,
      countryCode: country.countryCode,
    };
  }) || [];
