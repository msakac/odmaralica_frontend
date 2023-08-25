interface IRestriction {
  none: string[];
  user: string[];
  renter: string[];
  moderator: string[];
  admin: string[];
}

const restrictions: IRestriction = {
  none: ['user', 'renter', 'moderator', 'admin'],
  user: ['user', 'renter', 'moderator', 'admin'],
  renter: ['renter', 'moderator', 'admin'],
  moderator: ['moderator', 'admin'],
  admin: ['admin'],
};

export default restrictions;
