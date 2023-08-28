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
  UserList: IRoutePath;
  NewUser: IRoutePath;
  EditUser: IRoutePath;
  RegisterSuccess: IRoutePath;
  ActivateAccount: IRoutePath;
  OAuth2RedirectHandler: IRoutePath;
  CountryCrud: IRoutePath;
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
  UserList: { relativePath: 'user-list', absolutePath: '/dashboard/user-list' },
  NewUser: { relativePath: 'new', absolutePath: '/dashboard/user-list/new' },
  EditUser: { relativePath: ':id', absolutePath: '/dashboard/user-list/:id' },
  CountryCrud: { relativePath: 'countries', absolutePath: '/dashboard/countries' },
  OAuth2RedirectHandler: { relativePath: 'oauth2/redirect', absolutePath: '/oauth2/redirect' },
};

export default routes;
