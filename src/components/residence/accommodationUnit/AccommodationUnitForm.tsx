/* eslint-disable no-unused-vars */
import React from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Input from 'components/common/Input';
import CustomCheckbox from 'components/common/CustomCheckbox';
import { IAccommodationUnitPostDTO, IAccommodationUnitOmited } from 'types/accommodationUnit.types';

interface IAccommodationUnitFormProps {
  data: IAccommodationUnitOmited;
  setData: React.Dispatch<React.SetStateAction<IAccommodationUnitOmited>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fullWidth?: boolean;
  buttonText: string;
}

const AccommodationUnitForm = ({ data, setData, onSubmit, buttonText, fullWidth = false }: IAccommodationUnitFormProps) => {
  return (
    <Row className="gap-4 gap-xl-0 accommodation-unit-create-form">
      <Col lg={12} xl={fullWidth ? 12 : 6} className="mb-sm-4 mb-md-0">
        <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form h-100">
          <Card.Body>
            <Form onSubmit={onSubmit}>
              <Row className="gap-4">
                <Row className="justify-content-between align-items-center ">
                  <Col md={12} lg={8} className="mb-3">
                    <h6>{buttonText} Accommodation Unit</h6>
                  </Col>
                  <Col md={12} lg={4} className="mb-3">
                    <Button variant="warning" type="submit" className="w-100">
                      {buttonText}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Input
                      value={data!.name}
                      setValue={(e) => {
                        setData({ ...data!, name: e });
                      }}
                      label="Name"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Input
                      type="number"
                      value={data!.unitSize}
                      setValue={(e) => {
                        setData({ ...data!, unitSize: e });
                      }}
                      label="Unit Size"
                      help="Unit size in square meters"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Input
                      value={data!.beds}
                      setValue={(e) => {
                        setData({ ...data!, beds: e });
                      }}
                      label="Beds"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Input
                      type="number"
                      value={data!.numOfGuests}
                      setValue={(e) => {
                        setData({ ...data!, numOfGuests: e });
                      }}
                      label="Number of Guests"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Input
                      type="multiline"
                      value={data!.description}
                      setValue={(e) => {
                        setData({ ...data!, description: e });
                      }}
                      label="Description"
                    />
                  </Col>
                </Row>
                <Row className="gap-sm-2 gap-md-0">
                  <Col md={6}>
                    <Row className="flex-col gap-2 ">
                      <CustomCheckbox
                        value={data.privateKitchen || false}
                        label="Private Kitchen"
                        setValue={(e) => {
                          setData({ ...data!, privateKitchen: e });
                        }}
                      />
                      <CustomCheckbox
                        value={data.privateBathroom || false}
                        label="Private Bathroom"
                        setValue={(e) => {
                          setData({ ...data!, privateBathroom: e });
                        }}
                      />
                      <CustomCheckbox
                        value={data.terrace || false}
                        label="Terrace"
                        setValue={(e) => {
                          setData({ ...data!, terrace: e });
                        }}
                      />
                      <CustomCheckbox
                        value={data.tv || false}
                        label="TV"
                        setValue={(e) => {
                          setData({ ...data!, tv: e });
                        }}
                      />
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row className="flex-col gap-2 ">
                      <CustomCheckbox
                        value={data.seaView || false}
                        label="Sea View"
                        setValue={(e) => {
                          setData({ ...data!, seaView: e });
                        }}
                      />
                      <CustomCheckbox
                        value={data.pets || false}
                        label="Pets Allowed"
                        setValue={(e) => {
                          setData({ ...data!, pets: e });
                        }}
                      />
                      <CustomCheckbox
                        value={data.smoking || false}
                        label="Smoking Allowed"
                        setValue={(e) => {
                          setData({ ...data!, smoking: e });
                        }}
                      />
                    </Row>
                  </Col>
                </Row>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default AccommodationUnitForm;
