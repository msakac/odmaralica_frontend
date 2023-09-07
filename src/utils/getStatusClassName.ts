const getStatusClassName = (status: string) => {
  if (status === 'Cancelled') {
    return 'cancelled';
  }
  if (status === 'Finished') {
    return 'finished';
  }
  if (status === 'Upcoming') {
    return 'upcoming';
  }
  if (status === 'Active') {
    return 'active';
  }
  // You can add more conditions for other statuses if needed
  return ''; // Default class
};

export default getStatusClassName;
