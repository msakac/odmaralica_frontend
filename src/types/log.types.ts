import { IActivityTypeGetDTO } from './activityTypes.types';
import { IUserGetDTO } from './users.types';

export interface ILogGetDTO {
  id: string;
  user: IUserGetDTO;
  activityType: IActivityTypeGetDTO;
  logMessage: string;
  createdAt: string;
  httpMethod: string;
  endpoint: string;
  statusCode: string;
  ipAddress: string;
  responseTime: string;
}

export interface ILogEncryptedGetDTO {
  id: string;
  user: string;
  activityType: string;
  logMessage: string;
  createdAt: string;
  httpMethod: string;
  endpoint: string;
  statusCode: string;
  ipAddress: string;
  responseTime: string;
}
