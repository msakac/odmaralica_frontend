import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from 'pages/Home';
import Login from 'pages/Login';
import Register from 'pages/Register';
import ResetPassword from 'pages/ResetPassword';
import ForgotPassword from 'pages/ForgotPassword';
import RegisterSuccess from 'pages/RegisterSuccess';
import ActivateAccount from 'pages/ActivateAccount';
import OAuth2RedirectHandler from 'pages/OAuth2RedirectHandler';
import Profile from 'pages/Profile';
import SidebarLayout from 'components/layout/SidebarLayout';
import Countries from 'pages/Countries';
import DashboardHome from 'pages/DashboardHome';
import NotFound from 'pages/NotFound';
import Layout from 'components/layout/Layout';
import Logs from 'pages/Logs';
import Users from 'pages/Users';
import Regions from 'pages/Regions';
import Cities from 'pages/Cities';
import RenterResidences from 'pages/RenterResidences';
import CreateResidence from 'pages/CreateResidence';
import EditResidence from 'pages/EditResidence';
import AdminResidences from 'pages/AdminResidences';
import Explore from 'pages/Explore';
import Residence from 'pages/Residence';
import routes from './routes';
import restrictions from './restrictions';
import RequireAuth from './RequireAuth';

const Routing = () => {
  return (
    <Routes>
      <Route path={routes.Home.relativePath} element={<Layout />}>
        <Route index element={<Home />} />
        <Route path={routes.Login.relativePath} element={<Login />} />
        <Route path={routes.Register.relativePath} element={<Register />} />
        <Route path={routes.ResetPassword.relativePath} element={<ResetPassword />} />
        <Route path={routes.ForgotPassword.relativePath} element={<ForgotPassword />} />
        <Route path={routes.RegisterSuccess.relativePath} element={<RegisterSuccess />} />
        <Route path={routes.ActivateAccount.relativePath} element={<ActivateAccount />} />
        <Route path={routes.OAuth2RedirectHandler.relativePath} element={<OAuth2RedirectHandler />} />
        <Route path={routes.Explore.relativePath} element={<Explore />} />
        <Route path={routes.Residence.relativePath} element={<Residence />} />
        <Route
          path={routes.Profile.relativePath}
          element={<RequireAuth element={<Profile />} restrictedTo={restrictions.user} />}
        />
      </Route>
      <Route element={<SidebarLayout />}>
        <Route path={routes.Dashboard.absolutePath}>
          <Route index element={<RequireAuth element={<DashboardHome />} restrictedTo={restrictions.renter} />} />
          <Route
            path={routes.CountryCrud.relativePath}
            element={<RequireAuth element={<Countries />} restrictedTo={restrictions.admin} />}
          />
          <Route
            path={routes.Logs.relativePath}
            element={<RequireAuth element={<Logs />} restrictedTo={restrictions.admin} />}
          />
          <Route
            path={routes.Users.relativePath}
            element={<RequireAuth element={<Users />} restrictedTo={restrictions.admin} />}
          />
          <Route
            path={routes.Regions.relativePath}
            element={<RequireAuth element={<Regions />} restrictedTo={restrictions.admin} />}
          />
          <Route
            path={routes.Cities.relativePath}
            element={<RequireAuth element={<Cities />} restrictedTo={restrictions.admin} />}
          />
          <Route
            path={routes.AdminResidences.relativePath}
            element={<RequireAuth element={<AdminResidences />} restrictedTo={restrictions.moderator} />}
          />
          <Route
            path={routes.RenterResidences.relativePath}
            element={<RequireAuth element={<RenterResidences />} restrictedTo={restrictions.renter} />}
          />
          <Route
            path={routes.CreateResidence.relativePath}
            element={<RequireAuth element={<CreateResidence />} restrictedTo={restrictions.renter} />}
          />
          <Route
            path={routes.EditResidence.relativePath}
            element={<RequireAuth element={<EditResidence />} restrictedTo={restrictions.renter} />}
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
