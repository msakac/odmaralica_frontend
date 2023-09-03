import ResidenceCard from 'components/ResidenceCard';
import Animate from 'components/common/Animate';
import React from 'react';
// import { useGetCountriesQuery } from 'modules/address/country.api';
// import { Loader, Animate } from 'modules/common/components';
// import { ICountry } from 'modules/address/address.types';

const Home = () => {
  // const { data, isLoading, isFetching } = useGetCountriesQuery(null);
  // console.log(data);
  return (
    <>
      {/* <Loader show={isLoading || isFetching} /> */}
      <Animate>
        <div className="d-flex justify-content-center align-items-center">Homepage</div>
        <ResidenceCard />
      </Animate>
    </>
  );
};

export default Home;
