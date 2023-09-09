import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import routes from 'routes/routes';

const Footer = () => {
  return (
    <div className="footer align-items-center d-flex flex-column justify-content-center">
      <div className="footer-content-wrap">
        <Row className="w-100 footer-row">
          <Col xs={12} lg={3} className="mb-4 mb-lg-0 content-item-container">
            <div className="d-flex align-items-center info-content">
              <FontAwesomeIcon icon={faUmbrellaBeach} className="font-icon me-2" />
              <p className="mb-0">Odmaralica</p>
            </div>
            <p className="desc">Your next goto companion for travel</p>
          </Col>
          <Col xs={12} lg={3} className="mb-4 mb-lg-0 content-item-container">
            <p className="m-0 title">Company</p>
            <ul className="d-flex flex-column mt-3 gap-2">
              <li>
                <Card.Link>About</Card.Link>
              </li>
              <li>
                <Card.Link>Jobs</Card.Link>
              </li>
              <li>
                <Card.Link>Newsroom</Card.Link>
              </li>
              <li>
                <Card.Link>Advertising</Card.Link>
              </li>
              <li>
                <Card.Link>Contact us</Card.Link>
              </li>
            </ul>
          </Col>
          <Col xs={12} lg={3} className="mb-4 mb-lg-0 content-item-container">
            <p className="m-0 title">Explore</p>
            <ul className="d-flex flex-column mt-3 gap-2">
              <li>
                <Card.Link>Australia</Card.Link>
              </li>
              <li>
                <Card.Link>New Zealand</Card.Link>
              </li>
              <li>
                <Card.Link>Greece</Card.Link>
              </li>
              <li>
                <Card.Link>Maldives</Card.Link>
              </li>
              <li>
                <Card.Link>Singapore</Card.Link>
              </li>
            </ul>
          </Col>
          <Col xs={12} lg={3} className="mb-4 mb-lg-0 content-item-container">
            <p className="m-0 title">Terms and Policies</p>
            <ul className="d-flex flex-column mt-3 gap-2">
              <li>
                <Card.Link href={routes.PrivacyPolicy.absolutePath}>Privacy Policy</Card.Link>
              </li>
              <li>
                <Card.Link>Terms of use</Card.Link>
              </li>
              <li>
                <Card.Link>Accessibility</Card.Link>
              </li>
              <li>
                <Card.Link>Reward system policy</Card.Link>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
      <div className="w-100 footer-bottom">
        <div className="footer-bottom-inner">
          <p className="m-0">&copy; Odmaralica 2023</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
