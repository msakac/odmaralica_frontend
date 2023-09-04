/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import CustomCheckbox from './common/CustomCheckbox';

export interface IFilterBoxProps {
  budgetFilter: {
    min: number;
    max: number;
    enabled: boolean;
  }[];
  reviewFilter: string;
  setReviewFilter: React.Dispatch<React.SetStateAction<string>>;
  facilitiesFilter: {
    parking: boolean;
    wifi: boolean;
    airconditioning: boolean;
  };
  handleBudgetFilterChange: (index: number) => void;
  handleFacilitiesFilterChange: (filterName: 'wifi' | 'parking' | 'airconditioning') => void;
}

const FilterBox = ({
  budgetFilter,
  reviewFilter,
  setReviewFilter,
  facilitiesFilter,
  handleBudgetFilterChange,
  handleFacilitiesFilterChange,
}: IFilterBoxProps) => {
  return (
    <div className="filters">
      <h5>Filter by</h5>
      <div className="filter-box">
        <h6>Your budget per day</h6>
        <div className="filter-options">
          {budgetFilter.map((option, index) => (
            <CustomCheckbox
              key={index}
              value={option.enabled}
              label={`€ ${option.min} - € ${option.max}`}
              setValue={() => handleBudgetFilterChange(index)}
            />
          ))}
        </div>
      </div>
      <div className="filter-box">
        <h6>Rating</h6>
        <div className="filter-options">
          <p>Show only ratings more than</p>
          <ToggleButtonGroup
            color="primary"
            className="review-filter-group"
            value={reviewFilter}
            exclusive
            onChange={(e, value) => setReviewFilter(value)}
            aria-label="Residence type"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <ToggleButton key={index} value={index + 1}>
                {index + 1} <FontAwesomeIcon icon={faStar} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      </div>
      <div className="filter-box">
        <h6>Residence Facilities</h6>
        <div className="filter-options">
          <CustomCheckbox
            value={facilitiesFilter.parking}
            label="Free Parking"
            setValue={() => handleFacilitiesFilterChange('parking')}
          />
          <CustomCheckbox
            value={facilitiesFilter.wifi}
            label="Free Wifi"
            setValue={() => handleFacilitiesFilterChange('wifi')}
          />
          <CustomCheckbox
            value={facilitiesFilter.airconditioning}
            label="Free Air Conditioning"
            setValue={() => handleFacilitiesFilterChange('airconditioning')}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
