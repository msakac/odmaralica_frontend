import React from 'react';
import { ImageUploader } from 'modules/common/components/';
import Animate from '../../common/components/Animate';

const Home = () => {
  return (
    <Animate>
      <div className="d-flex justify-content-center align-items-center">Homepage</div>
      <ImageUploader />
    </Animate>
  );
};

export default Home;
