import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form, InputGroup, FormCheck, Button, Alert, Image } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthentication } from 'app/store';
import Google from 'assets/img/illustrations/google.svg';
import { useLoginMutation } from 'api/auth.api';
import { loginUser } from 'app/authenticationSlice';
import Loader from 'components/common/Loader';
import Animate from 'components/common/Animate';
import routes from 'routes/routes';
import { useLazyFindImagesQuery } from 'api/images.api';
import axios from 'axios';
import { IImageData } from 'types/IImageData';
import IResponse from 'types/IResponse';
import { ILoginResponseDTO } from 'types/auth.types';

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
  const [fetchImage] = useLazyFindImagesQuery();
  const [isFetchingImages, setIsFetchingImage] = useState<boolean>(false);
  const { oauthError } = location.state || '';

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

  const setStorageAndNavigate = (payload: IResponse<ILoginResponseDTO>, image?: IImageData) => {
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
      localStorage.setItem('accessToken', payload.data.accessToken);
      localStorage.setItem('refreshToken', payload.data.refreshToken);
    } else {
      sessionStorage.setItem('accessToken', payload.data.accessToken);
      sessionStorage.setItem('refreshToken', payload.data.refreshToken);
    }
    dispatch(
      loginUser({
        user: { ...payload.data.user, image },
        accessToken: payload.data.accessToken,
        refreshToken: payload.data.refreshToken,
      })
    );
    navigate(previousLocationState?.from.pathname || '/', { replace: true });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await loginUserApi({ email, password })
      .unwrap()
      .then((payload) => {
        fetchImage({ q: `user.id=${payload.data.user.id}` })
          .unwrap()
          .then((data) => {
            if (data.data.length === 0) {
              setStorageAndNavigate(payload, {} as IImageData);
            } else {
              const imageUrl = `http://localhost:8080/image/${data.data[0]}`;
              setIsFetchingImage(true);
              axios.get(imageUrl, { responseType: 'arraybuffer' }).then((response) => {
                const base64Image = btoa(
                  new Uint8Array(response.data).reduce((dta, byte) => dta + String.fromCharCode(byte), '')
                );
                const imageData: IImageData = { image: `data:image/png;base64,${base64Image}`, id: data.data[0] };
                setStorageAndNavigate(payload, imageData);
              });
            }
          });
      })
      .catch((err) => {
        setError(err.data.message);
      });
  }

  return (
    <main>
      <Loader show={isLoading || isFetchingImages} />
      <Animate>
        <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
          <Container>
            <Row className="justify-content-center">
              <Col xs lg={6} className="d-flex align-items-center justify-content-center">
                <div className="bg-white p-0 p-lg-2 w-100">
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <h3 className={`${error ? 'mb-2' : 'mb-5'}`}>Sign in</h3>
                    {(error || oauthError) && <Alert variant="danger">{error || oauthError}</Alert>}
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
                  <div className="text-center text-md-center mt-3">
                    <h5 className="mb-3">or</h5>
                  </div>
                  <Button
                    variant="outline-primary"
                    type="submit"
                    href="http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect"
                    className="w-100 d-flex align-items-center justify-content-center"
                  >
                    <Image rounded src={Google} className="img-fluid" style={{ maxHeight: '2.5vh' }} />
                    <p className="m-0 mx-2">Continue with Google</p>
                  </Button>
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
