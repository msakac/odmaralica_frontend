interface IRoutePath {
  relativePath: string;
  absolutePath: string;
}

interface IRoutes {
  Home: IRoutePath;
  Login: IRoutePath;
  Register: IRoutePath;
  Lock: IRoutePath;
  Profile: IRoutePath;
  ResetPassword: IRoutePath;
  NotFound: IRoutePath;
  Dashboard: IRoutePath;
  ForgotPassword: IRoutePath;
  RegisterSuccess: IRoutePath;
  ActivateAccount: IRoutePath;
  OAuth2RedirectHandler: IRoutePath;
  CountryCrud: IRoutePath;
  Logs: IRoutePath;
  Users: IRoutePath;
}

const routes: IRoutes = {
  Home: { relativePath: '/', absolutePath: '/' },
  Login: { relativePath: 'login', absolutePath: '/login' },
  Register: { relativePath: 'register', absolutePath: '/register' },
  Lock: { relativePath: 'lock', absolutePath: '/lock' },
  ResetPassword: { relativePath: 'reset-password', absolutePath: '/reset-password' },
  NotFound: { relativePath: 'not-found', absolutePath: '/not-found' },
  RegisterSuccess: { relativePath: 'register-success', absolutePath: '/register-success' },
  ActivateAccount: { relativePath: 'activate-account', absolutePath: '/activate-account' },
  Dashboard: { relativePath: 'dashboard', absolutePath: '/dashboard' },
  Profile: { relativePath: 'profile', absolutePath: '/profile' },
  ForgotPassword: { relativePath: 'forgot-password', absolutePath: '/forgot-password' },
  CountryCrud: { relativePath: 'countries', absolutePath: '/dashboard/countries' },
  OAuth2RedirectHandler: { relativePath: 'oauth2/redirect', absolutePath: '/oauth2/redirect' },
  Logs: { relativePath: 'logs', absolutePath: '/dashboard/logs' },
  Users: { relativePath: 'users', absolutePath: '/dashboard/users' },
};

export default routes;
