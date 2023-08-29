import { IErrorResponse } from '../definitions';

/**
 * Formats error response from server
 * @param {any} err error response from server
 * @returns {String} error message as string
 */
const formatErrorMessage = (err: IErrorResponse | IErrorResponse['message'] | any): string => {
  console.log(err);
  if (typeof err === 'string') {
    return err;
  }
  if (typeof err?.message === 'string') {
    return err?.message;
  }
  return 'Unknownd server error';
};

export default formatErrorMessage;
