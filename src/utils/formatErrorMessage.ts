import IErrorResponse from 'types/IErrorResponse';

/**
 * Formats error response from server
 * @param {any} err error response from server
 * @returns {String} error message as string
 */
const formatErrorMessage = (err: IErrorResponse | IErrorResponse['message'] | any): string => {
  if (typeof err === 'string') {
    return err;
  }
  if (typeof err?.message === 'string') {
    return err?.message;
  }
  console.error('Unknown server error:', err);
  return 'Unknown server error, check console for more details';
};

export default formatErrorMessage;
