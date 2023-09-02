/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export enum Currency {
  GBP = 'GBP',
  EUR = 'EUR',
  USD = 'USD',
}

export interface IAmount {
  id: string;
  amount: string;
  currency: Currency;
}

export interface IAmountPostDTO {
  amount: string;
  currency: Currency;
}
