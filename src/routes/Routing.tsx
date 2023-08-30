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
          {/* <Route path={routes.UserList.relativePath}>
            <Route index element={<RequireAuth element={<UserList />} restrictedTo={restrictions.admin} />} />
            <Route
              path={routes.NewUser.relativePath}
              element={<RequireAuth element={<NewUser />} restrictedTo={restrictions.admin} />}
            />
            <Route
              path={routes.EditUser.relativePath}
              element={<RequireAuth element={<EditUser />} restrictedTo={restrictions.admin} />}
            />
          </Route> */}
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
