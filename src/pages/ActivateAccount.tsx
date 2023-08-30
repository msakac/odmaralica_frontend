import React, { useEffect } from 'react';
import { Col, Container, Row, Card, Image, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import RegisterSuccessSvg from 'assets/img/illustrations/registerSuccess.svg';
import { useActivateAccountMutation } from 'api/auth.api';
import Loader from 'components/common/Loader';
import Animate from 'components/common/Animate';
import routes from 'routes/routes';

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const [activateAccount] = useActivateAccountMutation();
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate(routes.Home.relativePath);
      return;
    }
    const fetchData = async () => {
      await activateAccount({ token })
        .unwrap()
        .then()
        .catch((err) => {
          setError(err.data.message);
        });
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main>
      <Loader show={isLoading} />
      <Animate>
        <section className="vh-100 d-flex align-align-items-baseline  justify-content-center">
          <Container>
            <Row>
              <Col xs={12} className="text-center d-flex align-items-center justify-content-center">
                <div>
                  <Card.Link as={Link} to={routes.Home.relativePath}>
                    <Image src={RegisterSuccessSvg} className="img-fluid w-75" style={{ maxHeight: '50vh' }} />
                  </Card.Link>
                  {error ? (
                    <>
                      <h2 className="text-primary mt-3">Something went wrong...</h2>
                      <p className="lead my-4">{error}</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-primary mt-3">Success!</h2>
                      <p className="lead my-4">Thank you for activating your account!</p>
                      <p className="lead my-4">Now you can log in to the application.</p>
                      <p className="lead my-4">Happy traveling!</p>
                    </>
                  )}

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

export default ActivateAccount;
