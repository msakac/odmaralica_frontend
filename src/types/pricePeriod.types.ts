// eslint-disable-next-line import/no-cycle
import { IAccommodationUnit } from './accommodationUnit.types';
import { IAmount } from './amount.types';

export interface IPricePeriod {
  id: string;
  accommodationUnit: IAccommodationUnit;
  startAt: string;
  endAt: string;
  amount: IAmount;
}

export interface IPricePeriodPostDTO {
  accommodationUnitId: string;
  startAt: string;
  endAt: string;
  amountId: string;
}

export interface IPricePeriodPutDTO {
  id: string;
  accommodationUnitId: string;
  startAt: string;
  endAt: string;
  amountId: string;
}

export interface IPricePeriodCustom {
  id: string;
  accommodationUnitId: string;
  startAt: string;
  endAt: string;
  amount: IAmount;
}
