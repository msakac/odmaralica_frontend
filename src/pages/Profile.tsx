import { faAt, faKey, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Card, Col, Form, InputGroup, Row, Button, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useUpdateUserMutation } from 'api/users.api';
// import avatar from 'assets/img/avatars/avatar.png';
import { selectAuthentication } from 'app/store';
import Loader from 'components/common/Loader';
import Animate from 'components/common/Animate';
import { checkOneOf, sanitize } from 'utils';

const Profile = () => {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const { user } = useSelector(selectAuthentication);

  if (!user) return <div>No User Found</div>;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = sanitize({ name, surname, email, password, phoneNumber, description });

    if (!user) toast.error('User is not logged in');
    else if (checkOneOf([name, surname, email, password])) toast.error('Please fill at least one field');
    else {
      await updateUser({ id: user.id, body })
        .unwrap()
        .then((updatedUser) => {
          toast.success(`${updatedUser.name} has been successfully updated!`);
        });
    }
  }

  return (
    <>
      <Loader show={isLoading} />
      <Animate>
        <Card className="bg-white shadow-lg mb-4 profile-card mx-auto">
          <Card.Header>
            <Row className="flex-row align-items-center">
              <Image
                src="https://storage.cloud.google.com/odmaralica.appspot.com/jadransko%20more.jpg"
                className="img-fluid profile-image"
              />
              <h5 className="m-0 w-auto ">My Profile</h5>
            </Row>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group id="name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      required={false}
                      type="text"
                      defaultValue={user.name}
                      placeholder="Enter your first name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group id="surname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      required={false}
                      type="text"
                      defaultValue={user.surname}
                      placeholder="Also your last name"
                      onChange={(e) => setSurname(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faAt} />
                      </InputGroup.Text>
                      <Form.Control
                        required={false}
                        type="email"
                        defaultValue={user.email ?? ''}
                        placeholder="name@company.com"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group id="phone-number">
                    <Form.Label>Phone number</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faPhone} />
                      </InputGroup.Text>
                      <Form.Control
                        required={false}
                        type="text"
                        placeholder="Phone number"
                        defaultValue={user.phoneNumber ?? ''}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faKey} />
                      </InputGroup.Text>
                      <Form.Control
                        required={false}
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Form.Group id="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      required={false}
                      as="textarea"
                      rows={4}
                      defaultValue={user.description}
                      placeholder="Description"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Button variant="primary" type="submit" className="w-50 m-auto">
                  Update Profile
                </Button>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Animate>
    </>
  );
};

export default Profile;
