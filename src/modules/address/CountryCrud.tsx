import React, { useState } from 'react';
import { ICountry } from 'modules/address/address.types';
import { useGetCountriesQuery } from 'modules/address/country.api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Animate, Loader } from 'modules/common/components';
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
    { field: 'name', headerName: 'Country Name', width: 250 },
    { field: 'countryCode', headerName: 'CountryCode', width: 130 },
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
  const newRows =
    data?.data.map((country: ICountry) => {
      return {
        id: country.id,
        name: country.name,
        countryCode: country.countryCode,
      };
    }) || []; // Use an empty array as fallback
  // const rows = [
  //   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  //   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  //   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  //   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  //   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  //   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  //   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  //   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  //   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  // ];

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
      <Loader show={isLoading || isFetching} />
      <div className="overflow-auto">
        <Animate>
          <div style={{ width: 'fit-content' }}>
            <DataGrid
              rows={newRows}
              columns={columns}
              rowSelectionModel={selectedRows}
              onRowClick={handleSelectionModelChange}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              getRowClassName={getRowClassName}
            />
          </div>
        </Animate>
      </div>
    </>
  );
};

export default CountryCrud;
