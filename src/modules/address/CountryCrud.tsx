import React, { useState } from 'react';
// import { ICountry } from 'modules/address/address.types';
import { useGetCountriesQuery } from 'modules/address/country.api';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Animate } from 'modules/common/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faTrash, faInfo } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

const CountryCrud = () => {
  const { data, isLoading, isFetching } = useGetCountriesQuery(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleUpdate = (id: any) => {
    // Implement the logic to handle the update action here
    console.log(`Update row with ID: ${id}`);
  };

  const handleDelete = (id: any) => {
    // Implement the logic to handle the delete action here
    console.log(`Delete row with ID: ${id}`);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button variant="success" onClick={() => handleUpdate(params.row.id)}>
            <FontAwesomeIcon icon={faGear} />
          </Button>
          <Button variant="danger" className="mx-3" onClick={() => handleDelete(params.row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          <Button variant="info" onClick={() => handleDelete(params.row.id)}>
            <FontAwesomeIcon icon={faInfo} />
          </Button>
        </>
      ),
    },
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  const getRowClassName = (params: any) => {
    console.log(params);
    return params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-white' : 'bg-primary-subtle';
  };

  const handleSelectionModelChange = (newSelectionModel: any) => {
    console.log(newSelectionModel);
    setSelectedRows(newSelectionModel);
  };
  return (
    <>
      {/* <Loader show={isLoading || isFetching} /> */}
      <Animate>
        <div style={{ width: 'fit-content' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowSelectionModel={selectedRows}
            onRowClick={handleSelectionModelChange}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            getRowClassName={getRowClassName}
          />
        </div>
      </Animate>
    </>
  );
};

export default CountryCrud;
