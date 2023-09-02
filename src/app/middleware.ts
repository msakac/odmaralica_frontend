import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import IErrorResponse from 'types/IErrorResponse';
import formatErrorMessage from 'utils/formatErrorMessage';

// eslint-disable-next-line import/prefer-default-export
export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.log(action);
    toast.error(formatErrorMessage(action.payload.data as IErrorResponse | IErrorResponse['message']));
  }

  return next(action);
};
