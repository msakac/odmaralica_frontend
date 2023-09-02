import React, { RefObject, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useSearhText } from 'components/layout/SidebarLayout';
import Animate from 'components/common/Animate';
import Loader from 'components/common/Loader';
import { Action, ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import DataTable from 'components/data/DataTable';
import DeleteModalMessage from 'components/common/DeleteModalMessage';
import Dropdown from 'components/common/Dropdown';
import Input from 'components/common/Input';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCreatePricePeriodMutation, useFindPricePeriodsQuery, useUpdatePricePeriodMutation } from 'api/pricePeriod.api';
import { IPricePeriod, IPricePeriodCustom } from 'types/pricePeriod.types';
import { Currency } from 'types/amount.types';
import { useCreateAmountMutation, useUpdateAmountMutation, useDeleteAmountMutation } from 'api/amount.api';
import { getPricePeriodColumns, getPricePeriodRows } from 'components/data/DataTableConfigs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface IPricePeriodProps {
  accUnitId: string;
  actionMessageRef: RefObject<ActionMessagesRef>;
}

const PricePeriod = ({ accUnitId, actionMessageRef }: IPricePeriodProps) => {
  const pricePeriodEmpty: IPricePeriodCustom = {
    id: '',
    accommodationUnitId: accUnitId,
    startAt: '',
    endAt: '',
    amount: {
      id: '',
      currency: Currency.EUR,
      amount: '',
    },
  };

  /* Redux API Hooks */
  const { data, isLoading, isFetching, refetch } = useFindPricePeriodsQuery({ q: `accommodationUnit.id=${accUnitId}` });
  const [createPricePeriod, { isLoading: isLoadingPost }] = useCreatePricePeriodMutation();
  const [updatePricePeriod, { isLoading: isLoadingPut }] = useUpdatePricePeriodMutation();
  const [createAmount, { isLoading: isLoadingPostAmount }] = useCreateAmountMutation();
  const [updateAmount, { isLoading: isLoadingPutAmount }] = useUpdateAmountMutation();
  const [deleteAmount] = useDeleteAmountMutation();

  /* Model prop states */
  const [pricePeriodObj, setPricePeriodObj] = useState<IPricePeriodCustom>(pricePeriodEmpty);
  /* Action states */
  const [action, setAction] = useState<Action>(Action.None);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  /* Ref for setting DataTable width */
  const containerWrapRef = useRef<HTMLDivElement>(null);
  /* Outlet context for searching */
  const { searchText } = useSearhText();
  /* Searched data from API */
  const [searchedData, setSearchedData] = useState<IPricePeriod[]>([]);

  useEffect(() => {
    const filteredData = data?.data.filter(
      (p: IPricePeriod) =>
        p.amount.currency.toLowerCase().includes(searchText) ||
        p.amount.amount!.toString().includes(searchText) ||
        p.endAt.toLowerCase().includes(searchText) ||
        p.startAt.toLowerCase().includes(searchText)
    );
    setSearchedData(filteredData || []);
  }, [searchText, data]);

  const resetState = () => {
    setPricePeriodObj(pricePeriodEmpty);
    setIsFormOpen(false);
    setAction(Action.None);
    setShowDeleteModal(false);
  };

  const onDeleteClick = (id: string) => {
    resetState();
    setShowDeleteModal(true);
    const selectedRow = data?.data.find((row: IPricePeriod) => row.id === id);
    setPricePeriodObj({ ...pricePeriodObj, id, amount: selectedRow!.amount });
  };

  const onUpdateClick = (id: string) => {
    resetState();
    const selectedRow = data?.data.find((row: IPricePeriod) => row.id === id);
    const { ...rest } = selectedRow!;
    setPricePeriodObj({ ...rest, accommodationUnitId: accUnitId });
    setIsFormOpen(true);
    setAction(Action.Update);
  };

  const onCreateClick = () => {
    resetState();
    setIsFormOpen(true);
    setAction(Action.Create);
  };

  /* API Calls */
  async function deleteRow() {
    setShowDeleteModal(false);
    await deleteAmount({ id: pricePeriodObj.amount.id })
      .unwrap()
      .then(() => {
        actionMessageRef.current!.createMessage('Price period deleted!', MessageType.Ok);
        refetch();
      })
      .catch((err) => {
        actionMessageRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  async function updateRow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { amount, ...rest } = pricePeriodObj;
    await updatePricePeriod({ ...rest, amountId: amount.id })
      .unwrap()
      .then((dataUpdate) => {
        const message = `[${dataUpdate.status}] Updated Price Period!`;
        actionMessageRef.current!.createMessage(message, MessageType.Ok);
      })
      .catch((err) => {
        actionMessageRef.current!.createMessage(err.data.message, MessageType.Error);
      });

    await updateAmount(amount)
      .unwrap()
      .then(() => {
        refetch();
        resetState();
      })
      .catch((err) => {
        actionMessageRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  async function addPricePeriod(amountId: string) {
    const { accommodationUnitId, startAt, endAt } = pricePeriodObj;
    await createPricePeriod({ amountId, accommodationUnitId, startAt, endAt })
      .unwrap()
      .then((createdPricePeriod) => {
        const message = `[${createdPricePeriod.status}] Created new Price Period!`;
        actionMessageRef.current!.createMessage(message, MessageType.Ok);
        refetch();
        resetState();
      })
      .catch((err) => {
        actionMessageRef.current!.createMessage(err.data.message, MessageType.Error);
        deleteAmount({ id: amountId });
        // eslint-disable-next-line no-useless-return
      });
  }

  async function addRow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { amount } = pricePeriodObj;
    await createAmount(amount)
      .unwrap()
      .then((createdAmount) => {
        addPricePeriod(createdAmount.data.id);
      })
      .catch((err) => {
        if (err.code.toString() === '403') {
          actionMessageRef.current!.createMessage('Forbiden', MessageType.Error);
        } else {
          actionMessageRef.current!.createMessage(err.data.message, MessageType.Error);
        }
      });
  }

  const rows = getPricePeriodRows(searchedData);
  const columns = getPricePeriodColumns(onUpdateClick, onDeleteClick);
  const currencyDropdownOptions = Object.keys(Currency).map((key) => ({
    id: key,
    name: Currency[key as keyof typeof Currency],
  }));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Loader show={isLoading || isFetching || isLoadingPost || isLoadingPut || isLoadingPostAmount || isLoadingPutAmount} />
      <Row className="crud-wrap flex-column gap-2 mt-4" ref={containerWrapRef}>
        <h5>Price Periods</h5>

        <Row className="actions-wrap flex-column gap-2 align-items-start">
          {isFormOpen && (
            <Animate>
              <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form">
                <Card.Body>
                  <Button
                    variant="danger"
                    type="submit"
                    className="text-danger bg-transparent border-0 position-absolute top-0 end-0 close-form-btn"
                    onClick={resetState}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} size="2xl" />
                  </Button>
                  <h5 className="mb-4">{action === Action.Create ? 'Add New Price Period' : `Update Price Period`}</h5>
                  <Form onSubmit={action === Action.Create ? addRow : updateRow}>
                    <Row className="gap-4">
                      <Row>
                        <Col md={6} className="mb-3">
                          <DatePicker
                            label="Start At"
                            className="w-100"
                            value={dayjs(pricePeriodObj.startAt)}
                            onChange={(e) => {
                              setPricePeriodObj({ ...pricePeriodObj, startAt: dayjs(e!).format('YYYY-MM-DD') });
                            }}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <DatePicker
                            label="End At"
                            className="w-100"
                            value={dayjs(pricePeriodObj.endAt)}
                            onChange={(e) => {
                              setPricePeriodObj({ ...pricePeriodObj, endAt: dayjs(e!).format('YYYY-MM-DD') });
                            }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Input
                            value={pricePeriodObj.amount.amount}
                            type="number"
                            setValue={(e) => {
                              setPricePeriodObj({
                                ...pricePeriodObj,
                                amount: { ...pricePeriodObj.amount, amount: e },
                              });
                            }}
                            label="Price per night"
                          />{' '}
                        </Col>
                        <Col md={6} className="mb-3">
                          <Dropdown
                            value={pricePeriodObj.amount.currency}
                            setValue={(e) => {
                              setPricePeriodObj({
                                ...pricePeriodObj,
                                amount: { ...pricePeriodObj.amount, currency: Currency[e as keyof typeof Currency] },
                              });
                            }}
                            label="Region"
                            options={currencyDropdownOptions}
                          />{' '}
                        </Col>
                      </Row>
                    </Row>
                    <Row className="d-flex flex-row gap-3 justify-content-center ">
                      <Col lg={4}>
                        <Button variant="success" type="submit" className="w-100">
                          {action === Action.Create ? 'Create' : 'Update'}
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
              <Button variant="success" className="w-100" onClick={onCreateClick}>
                <FontAwesomeIcon icon={faPlus} size="xl" />
              </Button>
            </Col>
          )}
        </Row>
        <DataTable rows={rows} columns={columns} parentContainerRef={containerWrapRef} />
      </Row>
      <DeleteModalMessage
        showModal={showDeleteModal}
        id={pricePeriodObj.amount.id}
        resetState={() => setShowDeleteModal(false)}
        doAction={deleteRow}
        headerMsg="You are about to delete price period?"
        bodyMsg="Are you sure you want to delete this price period? This could take affect on you data!"
      />{' '}
    </LocalizationProvider>
  );
};

export default PricePeriod;
