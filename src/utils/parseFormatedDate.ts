const parseFormattedDate = (formattedDate: string): Date => {
  const [datePart, timePart] = formattedDate.split(' ');
  const [day, month, year] = datePart.split('.').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  // Months in JavaScript Date are zero-based, so subtract 1 from the month
  const date = new Date(year, month - 1, day, hours, minutes, seconds);

  return date;
};

export default parseFormattedDate;
