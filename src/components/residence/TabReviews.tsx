import { Rating } from '@mui/material';
import { useFindReviewsQuery } from 'api/review.api';
import Loader from 'components/common/Loader';
import React from 'react';
import { Card } from 'react-bootstrap';

interface ITabEditResidenceAddressProps {
  residenceId: string;
}

const TabReviews = ({ residenceId }: ITabEditResidenceAddressProps) => {
  const { data: reviews, isLoading, isFetching } = useFindReviewsQuery({ q: `residence.id=${residenceId}` });

  return (
    <>
      <Loader show={isLoading || isFetching} />
      <Card border="light" className="bg-white shadow-lg mb-4 position-relative create-form h-100">
        <div className="comments-wrap d-flex flex-row gap-3 w-100">
          {reviews?.data.map((review) => (
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
      </Card>
    </>
  );
};
export default TabReviews;
