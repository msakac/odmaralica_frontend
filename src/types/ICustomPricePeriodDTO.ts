import { IAmount } from './amount.types';

export interface ICustomPricePeriodDTO {
  id: string;
  startAt: string;
  endAt: string;
  amount: IAmount;
}
