import React from 'react';
import { ImageUploader } from 'modules/images';
import { useGetCountriesQuery } from 'modules/address/country.api';
import { Loader, Animate } from 'modules/common/components';
import { ICountry } from 'modules/address/address.types';

const Home = () => {
  const { data, isLoading, isFetching } = useGetCountriesQuery(null);

  return (
    <>
      <Loader show={isLoading || isFetching} />
      <Animate>
        <div className="d-flex justify-content-center align-items-center">Homepage</div>
        <ImageUploader />
        {data?.data.map((country: ICountry) => (
          <div key={country.id}>{country.name}</div>
        ))}
      </Animate>
    </>
  );
};

export default Home;
