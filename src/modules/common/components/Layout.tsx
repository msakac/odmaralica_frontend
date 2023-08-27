import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Footer from '../../dashboard/components/footer/Footer';
import NotifyContainer from './Notify';
import PublicNav from './PublicNav';

const Layout = () => {
  return (
    <>
      <Container fluid className="px-0 min-vh-100 bg-white">
        <NotifyContainer />
        <PublicNav />
        <Container className="d-flex flex-column justify-content-between root-container">
          <div>
            <Outlet />
          </div>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
