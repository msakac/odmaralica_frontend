import IResponse from './IResponse';

export default interface IErrorResponse {
  status: string;
  data: IResponse<Object>;
}
