import { useFindAddressQuery, useUpdateAddressMutation } from 'api/address.api';
import { useGetCountriesRegionsCitiesQuery } from 'api/country.api';
import { ActionMessagesRef, MessageType } from 'components/common/ActionMessages';
import Dropdown from 'components/common/Dropdown';
import Input from 'components/common/Input';
import Loader from 'components/common/Loader';
import React, { RefObject, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { IDropdown } from 'types/IDropdown.types';
import { ICountryRegionCityResponseDTO, ICustomCityDTO, ICustomRegionDTO } from 'types/country.types';

interface ITabEditResidenceAddressProps {
  residenceId: string;
  actionMessageRef: RefObject<ActionMessagesRef>;
}

const TabEditResidenceAddress = ({ residenceId, actionMessageRef }: ITabEditResidenceAddressProps) => {
  const {
    data: countryRegionCities,
    isLoading: isLoadingDropdownData,
    isFetching: isFetchingDropdownData,
  } = useGetCountriesRegionsCitiesQuery(null);
  const { data: address, isLoading, isFetching, refetch } = useFindAddressQuery({ q: `residence.id=${residenceId}` });
  const [updateAddress] = useUpdateAddressMutation();
  /* State */
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  /* Dropdown data */
  const [regionDropdownData, setRegionDropdownData] = useState<IDropdown[]>([]);
  const [cityDropdownData, setCityDropdownData] = useState<IDropdown[]>([]);

  const setDropdownData = () => {
    const countryRegions = countryRegionCities?.data.find((c: ICountryRegionCityResponseDTO) => c.id === country)?.regions;
    const regionDropdownOptions = countryRegions?.map((c: ICustomRegionDTO) => {
      return { id: c.id, name: c.name };
    });
    setRegionDropdownData(regionDropdownOptions || []);

    const regionCities = countryRegions?.find((r: ICustomRegionDTO) => r.id === region)?.cities;
    const cityDropdownOptions = regionCities?.map((c: ICustomCityDTO) => {
      return { id: c.id, name: c.name };
    });
    setCityDropdownData(cityDropdownOptions || []);
  };

  useEffect(() => {
    setCountry(address?.data[0].city.region.country.id || '');
    setRegion(address?.data[0].city.region.id || '');
    setCity(address?.data[0].city.id || '');
    setStreet(address?.data[0].street || '');
    setAdditionalInfo(address?.data[0].additional || '');
    setDropdownData();
  }, [address, countryRegionCities]);

  const countryDropdownOptions = countryRegionCities?.data.map((c: ICountryRegionCityResponseDTO) => {
    return { id: c.id, name: c.name };
  });

  useEffect(() => {
    setDropdownData();
  }, [country, region]);

  async function onSubmitUpdateAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedFields = {
      id: address!.data[0].id,
      residenceId,
      cityId: city,
      street,
      additional: additionalInfo,
    };
    await updateAddress(updatedFields)
      .unwrap()
      .then((dataUpdate) => {
        const message = `[${dataUpdate.status}] Updated Address for this residence`;
        actionMessageRef.current!.createMessage(message, MessageType.Ok);
        refetch();
      })
      .catch((err) => {
        actionMessageRef.current!.createMessage(err.data.message, MessageType.Error);
      });
  }

  return (
    <>
      <Loader show={isLoadingDropdownData || isFetchingDropdownData || isLoading || isFetching} />
      <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form h-100">
        <Card.Body>
          <Form onSubmit={onSubmitUpdateAddress}>
            <Row className="gap-4">
              <Row className="justify-content-between ">
                <Col md={6} className="mb-3">
                  <h5 className="mb-0 mb-lg-4">Address</h5>
                </Col>
                <Col md={12} lg={4} className="mb-3">
                  <Button variant="warning" type="submit" className="w-100">
                    Update Address
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Dropdown value={country} setValue={setCountry} label="Country" options={countryDropdownOptions} />
                </Col>
                <Col md={6} className="mb-3">
                  <Dropdown value={region} setValue={setRegion} label="Region" options={regionDropdownData} />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Dropdown value={city} setValue={setCity} label="City" options={cityDropdownData} />
                </Col>
                <Col md={6} className="mb-3">
                  <Input value={street} setValue={setStreet} label="Street" />
                </Col>
              </Row>
              <Row>
                <Col md={12} className="mb-3">
                  <Input value={additionalInfo} setValue={setAdditionalInfo} label="Additional Info" required={false} />
                </Col>
              </Row>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};
export default TabEditResidenceAddress;
