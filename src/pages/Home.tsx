import ResidenceCard from 'components/ResidenceCard';
import Animate from 'components/common/Animate';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from 'routes/routes';

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(routes.Explore.absolutePath);
  }, []);
  return (
    <Animate>
      <div className="d-flex justify-content-center align-items-center">Homepage</div>
      <ResidenceCard />
    </Animate>
  );
};

export default Home;
