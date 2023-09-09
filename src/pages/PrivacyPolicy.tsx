/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import privacyPolicy from 'data/privacyPolicy';
import CustomCheckbox from 'components/common/CustomCheckbox';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from 'app/authenticationSlice';
import { selectAuthentication } from 'app/store';
import { useLocation } from 'react-router-dom';
import { useUpdateUserMutation } from 'api/users.api';
import Loader from 'components/common/Loader';
import { useFindReservationsQuery } from 'api/reservation.api';
import dayjs from 'dayjs';

const PrivacyPolicy = () => {
  const { user, accessToken, refreshToken } = useSelector(selectAuthentication);
  const { data: reservations, isLoading, isFetching } = useFindReservationsQuery({ q: `user.id=${user!.id}` });
  const [update, { isLoading: isLoadingPut }] = useUpdateUserMutation();
  const [checked, setChecked] = useState(user?.policyAccepted || false);
  const location = useLocation();
  const { privacyPolicyNotice } = location.state || false;
  const dispatch = useDispatch();
  const [upcomingReservations, setUpcomingReservations] = useState<number>(0);

  useEffect(() => {
    const upcoming = reservations?.data.filter(
      (reservation) =>
        (dayjs(reservation.startAt).isAfter(dayjs()) || dayjs(reservation.endAt).isAfter(dayjs())) && !reservation.cancelled
    );
    setUpcomingReservations((upcoming && upcoming!.length) || 0);
  }, [reservations]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  async function acceptPrivacyPolicy() {
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

  return (
    <div className="privacy-policy">
      <Loader show={isLoadingPut || isLoading || isFetching} />
      <h1 className="privacy-policy-heading">Privacy Policy</h1>
      <div className="privacy-policy-container">
        {privacyPolicyNotice && (
          <Alert variant="warning">You have to accept Privacy Policy before making a reservation!</Alert>
        )}
        {privacyPolicy.map((policy, index) => (
          <div className="privacy-policy-item" key={index}>
            <h2>{policy.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: policy.description }} />
          </div>
        ))}
      </div>
      {user && (
        <Row className="privacy-policy-footer mt-3 d-flex justify-content-center flex-column align-items-center gap-3">
          <Col xs={12} md={6} className="text-center">
            <CustomCheckbox label="I agree to the Privacy Policy" value={checked} setValue={setChecked} />
          </Col>
          {checked && !user?.policyAccepted && (
            <Col xs={12} md={4}>
              <Button variant="warning" type="submit" className="w-100" onClick={acceptPrivacyPolicy}>
                Save my Consent
              </Button>
            </Col>
          )}
          {!checked && user?.policyAccepted && (
            <Row className="gap-2 justify-content-center ">
              <Col xs={12} className="text-center">
                <p className="text-danger">You have: {upcomingReservations} active or upcoming reservations! </p>
              </Col>
              <Col xs={12} md={4}>
                <Button
                  variant="danger"
                  type="submit"
                  className="w-100"
                  disabled={upcomingReservations > 0}
                  onClick={acceptPrivacyPolicy}
                >
                  Revoke my Conset
                </Button>
              </Col>
            </Row>
          )}
        </Row>
      )}
    </div>
  );
};

export default PrivacyPolicy;
