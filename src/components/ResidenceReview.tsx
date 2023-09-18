/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from 'react';
import { Rating } from '@mui/material';
import { IResidenceAggregateDTO } from 'types/residence.types';
import { Button } from 'react-bootstrap';
import { selectAuthentication } from 'app/store';
import { useSelector } from 'react-redux';
import { useCreateReviewMutation, useLazyCanReviewQuery } from 'api/review.api';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryDefinition } from '@reduxjs/toolkit/dist/query';
import IResponse from 'types/IResponse';
import Input from './common/Input';
import Loader from './common/Loader';

type IResidenceOverviewProps = {
  residence: IResidenceAggregateDTO | undefined;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      {
        id: string;
      },
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      IResponse<IResidenceAggregateDTO>,
      'rootApi'
    >
  >;
};

const ResidenceReview = ({ residence, refetch }: IResidenceOverviewProps) => {
  const [rating, setRating] = useState<number | null>(0);
  const [message, setMessage] = useState<string>('');
  const { user } = useSelector(selectAuthentication);
  const [checkUser, canUserReview] = useLazyCanReviewQuery();
  const [createReview, { isLoading: isLoadingReview }] = useCreateReviewMutation();

  // dovhatiti moram
  const avgReview = residence?.reviews.length
    ? residence?.reviews.reduce((acc, review) => acc + review.grade, 0) / residence?.reviews.length
    : 0;

  useEffect(() => {
    if (user) {
      checkUser({ userId: user.id, residenceId: residence?.id! });
    }
  }, [user]);

  async function addReview() {
    await createReview({
      userId: user!.id,
      residenceId: residence!.id,
      grade: rating?.toString()!,
      message,
    })
      .then(() => {
        refetch();
        checkUser({ userId: user!.id, residenceId: residence?.id! });
        setRating(0);
        setMessage('');
      })
      .catch((error) => {
        console.error('Error creating residence:', error);
      });
  }
  return (
    <>
      <Loader show={isLoadingReview} />
      <div className="review-wrapper">
        <h2>{residence?.name} - Review</h2>
        <div className="review-summary d-flex flex-column gap-3 justify-content-center  align-items-center ">
          <h1>{avgReview}</h1>
          <div className="review-summary-grade">
            <Rating name="read-only" value={avgReview} readOnly precision={0.5} size="large" />
          </div>
          <span className="review-summary-length">({residence?.reviews.length})</span>
        </div>
        <div className="reviews-container">
          {canUserReview?.data?.data === true && (
            <div className="add-review">
              <h6>Tell us about your experience at {residence?.name}</h6>
              <Rating
                name="read-only"
                value={rating}
                precision={0.5}
                size="medium"
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
              <Input value={message} setValue={setMessage} label="Comment" type="multiline" />
              {message && rating && (
                <Button variant="primary" className="w-100 mt-3" onClick={addReview}>
                  Add Review
                </Button>
              )}
            </div>
          )}
          <div className="comments">
            <h5>See what others think of {residence?.name} </h5>
            <div className="comments-wrap d-flex flex-row gap-3 w-100">
              {residence?.reviews.map((review) => (
                <div className="w-100 review-card">
                  <div className="review-card-header d-flex gap-4">
                    <span>
                      {review.user.name} {review.user.surname}
                    </span>
                    <div>
                      <Rating name="read-only" value={review.grade} readOnly precision={0.5} size="medium" />
                    </div>
                  </div>
                  <div>
                    <p>{review.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResidenceReview;
