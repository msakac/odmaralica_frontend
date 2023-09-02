/* eslint-disable func-names */
import { faAt, faKey, faPhone, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
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
/* Workflow - sliku ako korisnik oce promijeniti, preview je na avataru. Dok saljem update profile prvo sliku 
postavljam zatim saljem sve ostalo i opet dohvacam korisnikove podatake da ih spremim v slice */

const Profile = () => {
  /* Api calls */
  const [update, { isLoading: isLoadingPut }] = useUpdateUserMutation();
  const { user, accessToken, refreshToken } = useSelector(selectAuthentication);
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
        if (fileList && user?.image?.id) {
          deleteImageFromUser().then(() => {
            addImage().then(() => {
              fetchImage({ q: `user.id=${user.id}` })
                .unwrap()
                .then((data) => {
                  const imageUrl = `http://localhost:8080/image/${data.data[0]}`;
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
      <Loader show={isLoadingPut || isFetchingImages} />
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
          </Card.Body>
        </Card>
      </Animate>
    </div>
  );
};

export default Profile;
