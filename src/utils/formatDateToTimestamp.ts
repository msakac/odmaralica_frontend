const formatDateToTimestamp = (date: string): number => {
  if (!date) return 0;
  const dateObj = new Date(date);
  const timestamp = dateObj.getTime();
  return timestamp;
};

export default formatDateToTimestamp;
