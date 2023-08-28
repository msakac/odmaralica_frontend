export interface ICountry {
  id: string;
  name: string;
  countryCode: string;
}

export type ICountryPostDTO = Omit<ICountry, 'id'>;
