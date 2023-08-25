import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form, InputGroup, FormCheck, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Animate } from 'modules/common/components';
import { selectAuthentication } from 'app/store';
import routes from 'modules/common/routing/routes';
import { useLoginMutation } from './auth.api';
import { loginUser } from './authenticationSlice';

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
  const dispatch = useDispatch();
  const [loginUserApi, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { accessToken } = useSelector(selectAuthentication);

  const previousLocationState = location.state as LocationState;

  useEffect(() => {
    if (accessToken) {
      navigate(routes.Home.relativePath);
    }
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rememberMe = localStorage.getItem('rememberMe');
    await loginUserApi({ email, password })
      .unwrap()
      .then((payload) => {
        if (rememberMe === 'true') {
          localStorage.setItem('accessToken', payload.data.accessToken);
          localStorage.setItem('refreshToken', payload.data.refreshToken);
        } else {
          sessionStorage.setItem('accessToken', payload.data.accessToken);
          sessionStorage.setItem('refreshToken', payload.data.refreshToken);
        }
        dispatch(
          loginUser({
            user: payload.data.user,
            accessToken: payload.data.accessToken,
            refreshToken: payload.data.refreshToken,
          })
        );
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
            <Row className="justify-content-center">
              <Col xs={12} className="d-flex align-items-center justify-content-center">
                <div className="bg-white p-4 p-lg-5 w-lg-50 w-md-100">
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <h3 className={`${error ? 'mb-2' : 'mb-5'}`}>Sign in</h3>
                    {error && <Alert variant="danger">{error}</Alert>}
                  </div>
                  <Form className="mt-4" onSubmit={handleSubmit}>
                    <Form.Group id="email" className="mb-4">
                      <Form.Label>Email address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faEnvelope} />
                        </InputGroup.Text>
                        <Form.Control
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
                            Keep me signed in
                          </FormCheck.Label>
                        </Form.Check>
                        <Card.Link as={Link} to={routes.ForgotPassword.absolutePath} className="small text-end">
                          Forgot password?
                        </Card.Link>
                      </div>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                      Sign in
                    </Button>
                  </Form>
                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <span className="fw-normal">
                      Dont have an account?
                      <Card.Link as={Link} to={routes.Register.absolutePath} className="fw-bold">
                        {` Register `}
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
