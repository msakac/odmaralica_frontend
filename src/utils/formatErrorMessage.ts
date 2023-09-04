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
  // TODO dodai slikicu za erro 500 https://storyset.com/illustration/500-internal-server-error/cuate
  return 'Unknown server error, check console for more details';
};

export default formatErrorMessage;
