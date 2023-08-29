/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { ICountry } from 'modules/address/address.types';
import { useDeleteCountryMutation, useGetCountriesQuery } from 'modules/address/country.api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Animate, Loader } from 'modules/common/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import useDebounce from 'modules/common/hooks/useDebounce';
import { TextField } from '@mui/material';

const CountryCrud = () => {
  const { data, isLoading, isFetching, refetch } = useGetCountriesQuery(null);
  const [width, setWidth] = useState<number>(0);
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [okMessages, setOkMessages] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const crudWrapRef = useRef<HTMLDivElement>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  // const [createCounty, { isLoading: isLoadingPost }] = useCreateCountryMutation();
  // const [updateCountry, { isLoading: isLoadingPut }] = useUpdateCountryMutation();
  const [deleteCountry] = useDeleteCountryMutation();

  /* Messages */

  useEffect(() => {
    if (okMessages.length > 0) {
      setTimeout(() => {
        setOkMessages(okMessages.slice(1));
      }, 3500);
    }
    if (errorMessages.length > 0) {
      setTimeout(() => {
        setErrorMessages(errorMessages.slice(1));
      }, 3500);
    }
  }, [okMessages, errorMessages]);

  /* Table responsivnes */
  const adjustWidth = () => {
    const tableWrap = tableWrapRef.current;
    const crudWrap = crudWrapRef.current;
    if (tableWrap!.clientWidth > crudWrap!.clientWidth) {
      tableWrap!.style.width = 'unset';
    } else {
      tableWrap!.style.width = 'fit-content';
    }
  };

  useEffect(() => {
    const crudWrap = crudWrapRef.current;
    window.addEventListener('resize', () => {
      setWidth(crudWrap!.clientWidth);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWidth(crudWrap!.clientWidth);
      });
    };
  }, []);

  useDebounce(adjustWidth, 500, [width]);

  /* CRUD Handlers  */
  const handleUpdate = (id: number) => {
    console.log(`Update row with ID: ${id}`);
  };

  async function handleDelete(id: string) {
    await deleteCountry({ id })
      .unwrap()
      .then((dataDelete) => {
        setOkMessages([...okMessages, dataDelete.message]);
        refetch();
      })
      .catch((err) => {
        setErrorMessages([...errorMessages, err.data.message]);
      });
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('Create new country');
    console.log(name, countryCode);
  }

  /* DataTable definitions  */
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Country Name', width: 250 },
    { field: 'countryCode', headerName: 'CountryCode', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <Button variant="primary" onClick={() => handleUpdate(params.row.id)}>
            <FontAwesomeIcon icon={faGear} />
          </Button>
          <Button variant="danger" className="mx-3" onClick={() => handleDelete(params.row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      ),
    },
  ];

  const rows =
    data?.data.map((country: ICountry) => {
      return {
        id: country.id,
        name: country.name,
        countryCode: country.countryCode,
      };
    }) || [];

  const getRowClassName = (params: any) => {
    return params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-white' : 'bg-primary-subtle';
  };

  return (
    <>
      <Loader show={isLoading || isFetching} />
      <Row className="crud-wrap flex-column gap-2 mt-4" ref={crudWrapRef}>
        <Row className="actions-wrap flex-column gap-2 align-items-start">
          {isFormOpen && (
            <Animate>
              <Card border="light" className="bg-white shadow-lg mb-4">
                <Card.Body>
                  <h5 className="mb-4">Add New Country</h5>
                  <Form onSubmit={handleCreate}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <TextField
                          required
                          className="w-100"
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                          label="Country name"
                          size="small"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <TextField
                          required
                          label="Country code"
                          className="w-100"
                          size="small"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row className="d-flex flex-row gap-3 justify-content-center ">
                      <Col lg={4}>
                        <Button
                          variant="danger"
                          type="submit"
                          className="w-100"
                          data-testid="newUser-submit"
                          onClick={() => {
                            setIsFormOpen(true);
                          }}
                        >
                          Discard
                        </Button>
                      </Col>
                      <Col lg={4}>
                        <Button variant="success" type="submit" className="w-100" data-testid="newUser-submit">
                          Create
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Animate>
          )}
          {!isFormOpen && (
            <Col xs={4} lg={2}>
              <Button variant="success" className="w-100" onClick={() => setIsFormOpen(true)}>
                <FontAwesomeIcon icon={faPlus} size="xl" />
              </Button>
            </Col>
          )}
          <Col xs={12} lg={4}>
            {okMessages.map((message: string, index: number) => (
              <Animate>
                <Alert key={index} variant="success" className="w-fit">
                  {message}
                </Alert>
              </Animate>
            ))}
            {errorMessages.map((message: string, index: number) => (
              <Alert key={index} variant="danger" className="w-fit">
                {message}
              </Alert>
            ))}
          </Col>
        </Row>
        <Col className="table-wrap" ref={tableWrapRef}>
          <Animate>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              getRowClassName={getRowClassName}
            />
          </Animate>
        </Col>
      </Row>
    </>
  );
};

export default CountryCrud;
