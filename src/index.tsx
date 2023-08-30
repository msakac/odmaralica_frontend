/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import Routing from 'routes/Routing';
import { store, persistor } from './app/store'; // Import persistor

// styles
import './styles/custom.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
