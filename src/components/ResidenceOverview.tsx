/* eslint-disable no-unsafe-optional-chaining */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Rating } from '@mui/material';
import {
  faLocationDot,
  faWifi,
  faWind,
  faCar,
  faUmbrellaBeach,
  faStore,
  faWater,
  faUser,
  faPhone,
  faEnvelope,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import { IResidenceAggregateDTO } from 'types/residence.types';

type IResidenceOverviewProps = {
  residence: IResidenceAggregateDTO | undefined;
};
const ResidenceOverview = ({ residence }: IResidenceOverviewProps) => {
  const address = `${residence?.address.street}, ${residence?.address.city.name} ${residence?.address.city.zip}, ${residence?.address.city.region.country.name}`;
  const avgReview = residence?.reviews.length
    ? residence?.reviews.reduce((acc, review) => acc + review.grade, 0) / residence?.reviews.length
    : 0;
  return (
    <div className="residence-overview">
      <div className="overview-content">
        <div className="content-heading">
          <h1>{residence?.name}</h1>
          <div className="residence-ratings">
            <Rating name="read-only" value={avgReview} readOnly precision={0.5} size="small" />
            <span className="average-review">{avgReview}</span>
            <span className="reviews">({residence?.reviews.length || 0} reviews)</span>
          </div>
          <div className="residence-adress">
            <FontAwesomeIcon icon={faLocationDot} className="font-icon" size="sm" />
            <p>{address}</p>
          </div>
        </div>
        <div className="content-description">
          <div className="content-description-text">
            <h2>Overview</h2>
            <p>{residence?.description}</p>
          </div>
          <hr />
          <div className="content-description-facilities">
            <h2>Top facilities</h2>
            <div className="facility">
              <FontAwesomeIcon icon={faWifi} className="font-icon" size="sm" />
              <p>Free wifi: {residence?.isWifiFree ? 'Yes' : 'No'}</p>
            </div>
            <div className="facility">
              <FontAwesomeIcon icon={faWind} className="font-icon" size="sm" />
              <p>Air Conditioning: {residence?.isAirConFree ? 'Yes' : 'No'}</p>
            </div>
            <div className="facility">
              <FontAwesomeIcon icon={faCar} className="font-icon" size="sm" />
              <p>Free parking: {residence?.isParkingFree ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="overview-aside">
        <div className="asside-owner">
          <h2>About owner</h2>
          <div className="asside-owner-item">
            <FontAwesomeIcon icon={faUser} className="font-icon" size="sm" />
            <p>
              <b>Name:</b> {residence?.owner.name} {residence?.owner.surname}
            </p>
          </div>
          <div className="asside-owner-item">
            <FontAwesomeIcon icon={faPhone} className="font-icon" size="sm" />
            <p>
              <b>Phone number:</b> {residence?.owner.phoneNumber}
            </p>
          </div>
          <div className="asside-owner-item description">
            <FontAwesomeIcon icon={faFileLines} className="font-icon" size="sm" />
            <p>
              <b>Description:</b> {residence?.owner.description}
            </p>
          </div>
          <div className="asside-owner-item">
            <FontAwesomeIcon icon={faEnvelope} className="font-icon" size="sm" />
            <p>
              <b>Email:</b> {residence?.owner.email}
            </p>
          </div>
        </div>
        <div className="aside-explore">
          <h2>Explore the area</h2>
          <div className="explore-item">
            <FontAwesomeIcon icon={faWater} className="font-icon" size="sm" />
            <div className="explore-item-content">
              Distance from Sea <p>{residence?.distanceSea}m</p>
            </div>
          </div>
          <div className="explore-item">
            <FontAwesomeIcon icon={faUmbrellaBeach} className="font-icon" size="sm" />
            <div className="explore-item-content">
              Distance from Beach <p>{residence?.distanceBeach}m</p>
            </div>
          </div>
          <div className="explore-item">
            <FontAwesomeIcon icon={faStore} className="font-icon" size="sm" />
            <div className="explore-item-content">
              Distance from Store <p>{residence?.distanceStore}m</p>
            </div>
          </div>
          <div className="explore-item">
            <FontAwesomeIcon icon={faLocationDot} className="font-icon" size="sm" />
            <div className="explore-item-content">
              Distance from Center <p>{residence?.distanceCenter}m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidenceOverview;
