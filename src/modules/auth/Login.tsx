import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form, InputGroup, FormCheck, Button } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faEnvelope, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import routes from '../common/routing/routes';
import { useLoginMutation } from './auth.api';
import Loader from '../common/components/Loader';
import Animate from '../common/components/Animate';

interface IdealLocationState {
  from: {
    pathname: string;
  };
}

type LocationState = IdealLocationState | null;

const Login = () => {
  localStorage.setItem('rememberMe', 'false');
  const navigate = useNavigate();
  const location = useLocation();
  const [loginUser, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const previousLocationState = location.state as LocationState;

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (accessToken) {
      navigate(routes.Home.relativePath);
    }
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rememberMe = localStorage.getItem('rememberMe');

    await loginUser({ email, password })
      .unwrap()
      .then((payload) => {
        if (rememberMe === 'true') {
          localStorage.setItem('accessToken', payload.data.accessToken);
          localStorage.setItem('refreshToken', payload.data.refreshToken);
        } else {
          sessionStorage.setItem('accessToken', payload.data.accessToken);
          sessionStorage.setItem('refreshToken', payload.data.refreshToken);
        }
        navigate(previousLocationState?.from.pathname || '/', { replace: true });
      })
      .catch((err) => {
        setError(err.data.message);
      });
  }

  return (
    <main>
      <Loader show={isLoading} />
      <Animate>
        <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
          <Container>
            <p className="text-center">
              <Card.Link as={Link} to={routes.Home.relativePath} className="text-dark">
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
              </Card.Link>
            </p>
            <Row className="justify-content-center">
              <Col xs={12} className="d-flex align-items-center justify-content-center">
                <div className="bg-white p-4 p-lg-5 w-lg-50 w-md-100">
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <h3 className="mb-0">Sign in</h3>
                    {error && <p className="text-danger pt-3">{error}</p>}
                  </div>
                  <Form className="mt-4" data-testid="login-form" onSubmit={handleSubmit}>
                    <Form.Group id="email" className="mb-4">
                      <Form.Label>Email address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faEnvelope} />
                        </InputGroup.Text>
                        <Form.Control
                          data-testid="login-email"
                          name="email"
                          autoFocus
                          required
                          type="email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <Form.Group id="password" className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FontAwesomeIcon icon={faUnlockAlt} />
                          </InputGroup.Text>
                          <Form.Control
                            data-testid="login-password"
                            name="password"
                            required
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <Form.Check type="checkbox">
                          <FormCheck.Input
                            data-testid="login-rememberMe"
                            id="defaultCheck5"
                            className="me-2"
                            onChange={(e) => {
                              if (e.target.checked) {
                                localStorage.setItem('rememberMe', 'true');
                              } else {
                                localStorage.setItem('rememberMe', 'false');
                              }
                            }}
                          />
                          <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">
                            Remember me
                          </FormCheck.Label>
                        </Form.Check>
                        <Card.Link as={Link} to={routes.ForgotPassword.absolutePath} className="small text-end">
                          Lost password?
                        </Card.Link>
                      </div>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100" data-testid="login-submit">
                      Sign in
                    </Button>
                  </Form>
                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <span className="fw-normal">
                      Not registered?
                      <Card.Link as={Link} to={routes.Register.absolutePath} className="fw-bold">
                        {` Create account `}
                      </Card.Link>
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Animate>
    </main>
  );
};

export default Login;
