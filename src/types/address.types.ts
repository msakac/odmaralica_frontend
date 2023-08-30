export interface ICountry {
  id: string;
  name: string;
  countryCode: string;
}

export type ICountryPostDTO = Omit<ICountry, 'id'>;

interface ICustomCityDTO {
  id: string;
  name: string;
  zip: string;
}

interface ICustomRegionDTO {
  id: string;
  name: string;
  cities: ICustomCityDTO[];
}

export interface ICountryRegionCityResponseDTO {
  id: string;
  name: string;
  regions: ICustomRegionDTO[];
}
