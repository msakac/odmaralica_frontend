import { IResidence } from './residence.types';
import { IUser } from './users.types';

export interface IImage {
  id: string;
  user: IUser;
  accommodationUnit: string;
  residence: IResidence;
  createdBy: IUser;
  createdDate: string;
}
