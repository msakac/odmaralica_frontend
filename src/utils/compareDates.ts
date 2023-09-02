import parseFormattedDate from './parseFormatedDate';

function compareDates(a: string, b: string) {
  const timestampA = parseFormattedDate(a);
  const timestampB = parseFormattedDate(b);

  if (timestampA < timestampB) {
    return -1;
  }
  if (timestampA > timestampB) {
    return 1;
  }
  return 0;
}

export default compareDates;
