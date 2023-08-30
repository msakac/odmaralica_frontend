import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet, useOutletContext } from 'react-router-dom';
import NotifyContainer from 'components/common/Notify';
import Footer from './Footer';
import DashNav from './DashNav';
import Sidebar from './Sidebar';

type ContextType = { searchText: string };

const SidebarLayout = () => {
  const [searchText, setSearchText] = useState<string>('');

  const setSearchTerm = (term: string) => {
    setSearchText(term);
  };

  return (
    <Container fluid className="px-0 root-container-dashboard">
      <NotifyContainer />
      <Row className="flex-md-nowrap px-0 mx-0 sidebar layout">
        <Col className="px-0 mb-2 mb-md-0 sidebar-scroll overflow-y-auto">
          <Sidebar />
        </Col>
        <Col className="d-flex flex-column content-wrap justify-content-between pt-4">
          <div className="dashboard-content-container">
            <DashNav setSearchTerm={setSearchTerm} />
            <Outlet context={{ searchText }} />
          </div>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default SidebarLayout;

export function useSearhText() {
  return useOutletContext<ContextType>();
}
