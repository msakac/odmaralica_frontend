/* eslint-disable func-names */
import { faAt, faKey, faPhone, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Form, InputGroup, Row, Button, Image, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import avatar from 'assets/img/avatars/avatar.png';
import { selectAuthentication } from 'app/store';
import Animate from 'components/common/Animate';
import { useUpdateUserMutation } from 'api/users.api';
import { IUser } from 'types/users.types';
import Loader from 'components/common/Loader';

import { loginUser } from 'app/authenticationSlice';
import { useDeleteImageMutation, useLazyFindImagesQuery, useUploadImageMutation } from 'api/images.api';
import axios from 'axios';
import { IImageData } from 'types/IImageData';
import Input from 'components/common/Input';
import routes from 'routes/routes';
import dayjs from 'dayjs';
import { useFindReservationsQuery } from 'api/reservation.api';
/* Workflow - sliku ako korisnik oce promijeniti, preview je na avataru. Dok saljem update profile prvo sliku 
postavljam zatim saljem sve ostalo i opet dohvacam korisnikove podatake da ih spremim v slice */

/*
Workflow - privacy:
 1. Ako korisnik ima prihvaceni Policy, onda dolje u Privacy Policy moze revokati 
 svoj consent na nacin da salje put request za svoj account i tu vrijednost setiram i u bazi. Korisnik nebre revokati
  consent ako ima aktivne ili nadolazece rezervacije.

 */

const Profile = () => {
  /* Api calls */
  const [update, { isLoading: isLoadingPut }] = useUpdateUserMutation();
  const { user, accessToken, refreshToken } = useSelector(selectAuthentication);
  const { data: reservations, isLoading, isFetching } = useFindReservationsQuery({ q: `user.id=${user!.id}` });
  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [fetchImage] = useLazyFindImagesQuery();
  /* State and stuff */
  const [imagePreview, setImagePreview] = useState<string>('');
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [userData, setUserData] = useState<IUser>({ ...user!, password: '' });
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch();
  const [isFetchingImages, setIsFetchingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reason, setReason] = useState<string>('');
  const [upcomingReservations, setUpcomingReservations] = useState<number>(0);

  useEffect(() => {
    const upcoming = reservations?.data.filter(
      (reservation) =>
        (dayjs(reservation.startAt).isAfter(dayjs()) || dayjs(reservation.endAt).isAfter(dayjs())) && !reservation.cancelled
    );
    setUpcomingReservations((upcoming && upcoming!.length) || 0);
  }, [reservations]);

  async function addImage() {
    const promises = [];
    const file = fileList![0];
    const imageDataPost = new FormData();
    imageDataPost.append('imageFile', file);
    imageDataPost.append('userId', userData.id);
    promises.push(uploadImage(imageDataPost));

    await Promise.all(promises);
    setFileList(null);
    setImagePreview('');
  }

  async function deleteImageFromUser() {
    await deleteImage({ id: user?.image?.id! });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await update(userData)
      .unwrap()
      .then((dataUpdate) => {
        setIsFetchingImage(true);
        if (fileList) {
          deleteImageFromUser().then(() => {
            addImage().then(() => {
              fetchImage({ q: `user.id=${user!.id}` })
                .unwrap()
                .then((data) => {
                  const imageUrl = `http://192.168.1.11:8080/image/${data.data[0]}`;
                  axios.get(imageUrl, { responseType: 'arraybuffer' }).then((response) => {
                    const base64Image = btoa(
                      new Uint8Array(response.data).reduce((dta, byte) => dta + String.fromCharCode(byte), '')
                    );
                    const imageData: IImageData = { image: `data:image/png;base64,${base64Image}`, id: data.data[0] };
                    const { password, ...restData } = dataUpdate.data;
                    dispatch(
                      loginUser({
                        user: { ...restData, image: imageData },
                        accessToken: accessToken!,
                        refreshToken: refreshToken!,
                      })
                    );
                    setIsFetchingImage(false);
                  });
                });
            });
          });
        } else {
          const { password, ...restData } = dataUpdate.data;
          dispatch(
            loginUser({
              user: { ...restData, image: user!.image },
              accessToken: accessToken!,
              refreshToken: refreshToken!,
            })
          );
          setIsFetchingImage(false);
        }
      })
      .catch((err) => {
        setError(err.data.message);
      });
  }

  async function revokePrivacyPolicy() {
    await update({ ...user!, password: '', policyAccepted: !user?.policyAccepted })
      .unwrap()
      .then((dataUpdate) => {
        const { password, ...restData } = dataUpdate.data;
        dispatch(
          loginUser({
            user: { ...restData, image: user!.image },
            accessToken: accessToken!,
            refreshToken: refreshToken!,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    setFileList(files);
    Array.prototype.forEach.call(files, function (file) {
      setImagePreview(URL.createObjectURL(file));
    });
  };

  const handleIconClick = () => {
    fileInputRef.current!.click();
  };

  return (
    <div className="pt-4">
      <Loader show={isLoadingPut || isFetchingImages || isLoading || isFetching} />
      <Animate>
        <Card className="bg-white shadow-lg mb-4 profile-card mx-auto">
          <Card.Header>
            <div className="profile-avatar">
              <Image src={imagePreview || user?.image?.image || avatar} className="img-fluid profile-image" />
              <Button onClick={handleIconClick} className="upload-button">
                <FontAwesomeIcon icon={faCamera} className="" size="xl" />
              </Button>
              <h5 className="m-0 w-auto ">My Profile</h5>
            </div>
            <Form.Control
              type="file"
              className="text-primary mb-2 d-none"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageSelection}
            />
          </Card.Header>
          <Card.Body className="p-4">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group id="name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={userData.name}
                      placeholder="Enter your first name"
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group id="surname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={userData.surname}
                      placeholder="Also your last name"
                      onChange={(e) => setUserData({ ...userData, surname: e.target.value })}
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
                        type="email"
                        defaultValue={userData.email}
                        placeholder="name@company.com"
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
                        defaultValue={userData.phoneNumber}
                        onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
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
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
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
                      defaultValue={userData.description}
                      placeholder="Description"
                      onChange={(e) => setUserData({ ...userData, description: e.target.value })}
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
            <Row className="my-3 privacy">
              <Col sm={12}>
                <h5 className="">My Privacy</h5>
              </Col>
              <hr />
              <Col sm={12} className="text-center mb-3">
                <h6>Privacy Policy</h6>
              </Col>
              <Col sm={12} className="d-flex flex-row gap-2 mb-3 align-items-center text-center">
                <h6 className="text-danger ml-2 text my-0 w-100">{user?.policyAccepted ? 'Accepted' : 'Not Accepted'}</h6>
              </Col>
              {!user?.policyAccepted && (
                <Col sm={12} md={4} className="d-flex flex-row gap-2 align-items-center mb-3 m-auto ">
                  <Button variant="outline-primary" className="w-100" href={routes.PrivacyPolicy.absolutePath}>
                    Read Privacy Policy
                  </Button>
                </Col>
              )}
              {user?.policyAccepted && (
                <Row className="gap-2">
                  <Col sm={12} md={12} className="deletion-message">
                    <p>You cannot revoke privacy policy if You have any upcoming or active reservations!</p>
                    <p className="text-danger">You have: {upcomingReservations} active or upcoming reservations! </p>
                  </Col>
                  <Col sm={12} md={6} className="d-flex flex-row gap-2 align-items-center mb-3 m-auto">
                    <Button
                      variant="outline-danger"
                      className="w-100"
                      disabled={(upcomingReservations && upcomingReservations > 0) || false}
                      onClick={revokePrivacyPolicy}
                    >
                      Revoke My Consent
                    </Button>
                  </Col>
                </Row>
              )}
              <hr />
              <Col sm={12} className="text-center my-3">
                <h6>Delete my data</h6>
              </Col>
              <Col sm={12} className="d-flex flex-row gap-2 mb-3 align-items-center text-center">
                <Input type="multiline" label="Reason for data deletion" value={reason} setValue={setReason} />
              </Col>

              {reason && (
                <Row className="gap-2">
                  <Col sm={12} md={12} className="deletion-message">
                    <p>Data deletion process:</p>
                    <ul>
                      <li>
                        Data deletion is <span className="text-danger">not possible</span> if user has active or upcoming
                        reservations. Those reservations need to be cancelled.
                      </li>
                      <li>
                        Once you create data deletion request moderator will review your request and if valid, accept data
                        deletion.
                      </li>
                      <li>
                        Data deletion includes removing all of private information from user account including all reviews
                        made on any residence. Account is not deleted as according to Privacy Policy.
                      </li>
                      <li>After data deletion is accepted, user will no longer be able to login to the application.</li>
                    </ul>
                    <p className="text-danger">You have: {upcomingReservations} active or upcoming reservations! </p>
                  </Col>
                  <Col sm={12} md={6} className="d-flex flex-row gap-2 align-items-center mb-3 m-auto ">
                    <Button variant="danger" className="w-100" disabled={upcomingReservations > 0}>
                      Create Deletion Request
                    </Button>
                  </Col>
                </Row>
              )}
            </Row>
          </Card.Body>
        </Card>
      </Animate>
    </div>
  );
};

export default Profile;
