import { faEnvelope, faUnlockAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { getStatusCode } from 'http-status-codes';
import { useRegisterMutation } from 'api/auth.api';
import Loader from 'components/common/Loader';
import Animate from 'components/common/Animate';

const Register = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    await registerUser({ name, surname, email, password })
      .unwrap()
      .then((data) => {
        if (getStatusCode(data.status) === 200) {
          navigate('/register-success', { state: { email, name, surname } });
        }
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
              <Col xs lg={6} className="d-flex align-items-center justify-content-center">
                <div className="bg-white border rounded p-0 p-lg-2 w-100">
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <h3 className={`${error ? 'mb-2' : 'mb-5'}`}>Register</h3>
                    {error && <Alert variant="danger">{error}</Alert>}
                  </div>
                  <Form className="mt-4" onSubmit={handleSubmit}>
                    <Form.Group id="name" className="mb-4">
                      <Form.Label>Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUser} />
                        </InputGroup.Text>
                        <Form.Control
                          name="name"
                          autoFocus
                          required
                          type="text"
                          placeholder="John"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group id="name" className="mb-4">
                      <Form.Label>Surname</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUser} />
                        </InputGroup.Text>
                        <Form.Control
                          name="surname"
                          autoFocus
                          required
                          type="text"
                          placeholder="Doe"
                          onChange={(e) => setSurname(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
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
                          placeholder="example@company.com"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
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
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                      Register
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Animate>
    </main>
  );
};

export default Register;
