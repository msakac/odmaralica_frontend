/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IAuthenticatedUserDTO } from 'types/users.types';

export interface AuthenticationState {
  user: IAuthenticatedUserDTO | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthenticationState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    loginUser: (
      state,
      action: PayloadAction<{ user: IAuthenticatedUserDTO | null; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { loginUser, logoutUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
