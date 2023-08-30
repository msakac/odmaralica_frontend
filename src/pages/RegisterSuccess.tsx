import React from 'react';
import { Col, Container, Row, Card, Image, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Animate from 'components/common/Animate';
import routes from 'routes/routes';
import registerSuccessSvg from '../assets/img/illustrations/registerSuccess.svg';

const RegisterSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name } = location.state;
  return (
    <main>
      <Animate>
        <section className="vh-100 d-flex align-align-items-baseline  justify-content-center">
          <Container>
            <Row>
              <Col xs={12} className="text-center d-flex align-items-center justify-content-center">
                <div>
                  <Card.Link as={Link} to={routes.Home.relativePath}>
                    <Image src={registerSuccessSvg} className="img-fluid w-75" style={{ maxHeight: '50vh' }} />
                  </Card.Link>
                  <p className="lead my-2">Hey {name}!</p>
                  <h2 className="text-primary mt-3">Welcome to Odmaralica</h2>
                  <p className="lead my-4">You have been successfully registered with email {email}.</p>
                  <p className="lead my-4">
                    An <span className="fw-bolder text-primary">activation link</span> has been sent to your email. Please
                    click on the link to activate your account.
                  </p>
                  <Button variant="primary" className="animate-hover" onClick={() => navigate(routes.Login.relativePath)}>
                    <FontAwesomeIcon icon={faChevronLeft} className="animate-left-3 me-3 ms-2" />
                    Sign in
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Animate>
    </main>
  );
};

export default RegisterSuccess;
