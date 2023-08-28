import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OAuth2RedirectHandler from 'modules/auth/OAuth2RedirectHandler';
import { CountryCrud } from 'modules/address';
import RequireAuth from './RequireAuth';
import { ForgotPassword, Login, Register, ResetPassword } from '../../auth';
import { DashboardHome, Profile } from '../../dashboard';
import Home from '../../pages/home/Home';
import restrictions from './restrictions';
import routes from './routes';
import Layout from '../components/Layout';
import SidebarLayout from '../../dashboard/components/layout/SidebarLayout';
import UserList from '../../users/UserList';
import NewUser from '../../users/NewUser';
import EditUser from '../../users/EditUser';
import NotFound from './NotFound';
import RegisterSuccess from '../../auth/RegisterSuccess';
import ActivateAccount from '../../auth/ActivateAccount';

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
            element={<RequireAuth element={<CountryCrud />} restrictedTo={restrictions.admin} />}
          />
          <Route path={routes.UserList.relativePath}>
            <Route index element={<RequireAuth element={<UserList />} restrictedTo={restrictions.admin} />} />
            <Route
              path={routes.NewUser.relativePath}
              element={<RequireAuth element={<NewUser />} restrictedTo={restrictions.admin} />}
            />
            <Route
              path={routes.EditUser.relativePath}
              element={<RequireAuth element={<EditUser />} restrictedTo={restrictions.admin} />}
            />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
