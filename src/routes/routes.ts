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
  Cities: IRoutePath;
  Regions: IRoutePath;
  RenterResidences: IRoutePath;
  CreateResidence: IRoutePath;
  EditResidence: IRoutePath;
  AdminResidences: IRoutePath;
  EditAccommodationUnit: IRoutePath;
  Explore: IRoutePath;
  Residence: IRoutePath;
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
  Cities: { relativePath: 'cities', absolutePath: '/dashboard/cities' },
  Regions: { relativePath: 'regions', absolutePath: '/dashboard/regions' },
  AdminResidences: { relativePath: 'residences', absolutePath: '/dashboard/residences' },
  RenterResidences: { relativePath: 'renter-residences', absolutePath: '/dashboard/renter-residences' },
  CreateResidence: { relativePath: 'renter-residences/create', absolutePath: '/dashboard/renter-residences/create' },
  EditResidence: { relativePath: 'renter-residences/edit/:id', absolutePath: '/dashboard/renter-residences/edit/:id' },
  EditAccommodationUnit: {
    relativePath: 'renter-residences/edit/:id/accommodation-unit/:accommodationUnitId',
    absolutePath: '/dashboard/renter-residences/edit/:id/accommodation-unit/:accommodationUnitId',
  },
  Explore: { relativePath: 'explore', absolutePath: '/explore' },
  Residence: { relativePath: '/residence', absolutePath: '/residence' },
};

export default routes;
