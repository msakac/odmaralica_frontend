import React, { useEffect } from 'react';
import { Col, Container, Row, Card, Image, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { performLogout } from 'app/store';
import SessionExpiredImg from '../assets/img/illustrations/sessionExpired.svg';
import routes from '../routes/routes';
import Animate from '../components/common/Animate';

const SessionExpired = () => {
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  useEffect(() => {
    dispatcher(performLogout());
  }, []);

  return (
    <main>
      <Animate>
        <section className="vh-100 d-flex align-items-start justify-content-center">
          <Container>
            <Row>
              <Col xs={12} className="text-center d-flex align-items-center justify-content-center">
                <div>
                  <Card.Link as={Link} to={routes.Login.absolutePath}>
                    <Image src={SessionExpiredImg} className="img-fluid w-75" style={{ maxHeight: '50vh' }} />
                  </Card.Link>
                  <h1 className="text-primary mt-5">
                    You have Been <span className="fw-bolder">Logged Out</span>
                  </h1>
                  <p className="lead my-4">Tokens have expired. Please login again.</p>
                  <Button variant="primary" className="animate-hover" onClick={() => navigate(routes.Login.absolutePath)}>
                    <FontAwesomeIcon icon={faSignIn} className="animate-left-3 me-3 ms-2" />
                    Go to login
                  </Button>
                </div>
              </Col>
            </Row>
            <div className="text-center mt-3">
              <a href="https://storyset.com/web">Web illustrations by Storyset</a>
            </div>
          </Container>
        </section>
      </Animate>
    </main>
  );
};

export default SessionExpired;
