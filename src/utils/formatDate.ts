const formatDate = (date: string): string => {
  if (!date) return '';
  const dateObj = new Date(date);
  // Extract components from the Date object
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const seconds = dateObj.getSeconds().toString().padStart(2, '0');

  // Format the date and time components into the desired format
  const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};

export default formatDate;
