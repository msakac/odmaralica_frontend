/* eslint-disable no-param-reassign */
import { useGetAggregateResidenceesQuery } from 'api/residence.api';
import ImageCardWrap from 'components/ImageCardWrap';
import ResidenceCard from 'components/ResidenceCard';
import Animate from 'components/common/Animate';
import Loader from 'components/common/Loader';
import React, { useEffect } from 'react';

const Residence = () => {
  const { data, isLoading, isFetching } = useGetAggregateResidenceesQuery(null);
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <Loader show={isLoading || isFetching} />
      <Animate>
        <ResidenceCard />
        <ImageCardWrap />
      </Animate>
    </>
  );
};

export default Residence;
