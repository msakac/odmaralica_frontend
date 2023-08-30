/* eslint-disable import/no-extraneous-dependencies */
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query/react';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use local storage as the storage engine
import api from './api';
import authenticationReducer, { logoutUser } from './authenticationSlice';
import { rtkQueryErrorLogger } from './middleware';

const persistConfig = {
  key: 'root',
  storage,
};

// Wrap the authentication reducer with the Redux Persist higher-order reducer
const persistedAuthReducer = persistReducer(persistConfig, authenticationReducer);

// Configure the Redux store with the persisted authentication reducer
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    authentication: persistedAuthReducer, // Use the persisted reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware, rtkQueryErrorLogger),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const performLogout = (): AppThunk => (dispatch) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  dispatch(logoutUser());
};

export const selectAuthentication = (state: RootState) => state.authentication;

export const persistor = persistStore(store);
