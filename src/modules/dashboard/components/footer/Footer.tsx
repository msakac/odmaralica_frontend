import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer py-5">
      <Row className="m-0">
        <Col xs={12} lg={6} className="mb-4 mb-lg-0">
          <p className="mb-0 text-center text-xl-left">
            Copyright © 2023
            <Card.Link className="text-blue text-decoration-none fw-normal"> Odmaralica</Card.Link>
          </p>
        </Col>
        <Col xs={12} lg={6}>
          <ul className="list-inline list-group-flush list-group-borderless text-center text-xl-right mb-0">
            <li className="list-inline-item px-0 px-sm-2">
              <Card.Link>About</Card.Link>
            </li>
            <li className="list-inline-item px-0 px-sm-2">
              <Card.Link>Contact</Card.Link>
            </li>
          </ul>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
