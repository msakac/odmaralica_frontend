function compareNumbers(responseTimeA: string, responseTimeB: string) {
  // Split the response time values by space and get the numeric parts
  const [numericPartA] = responseTimeA.split(' ').map(parseFloat);
  const [numericPartB] = responseTimeB.split(' ').map(parseFloat);

  // Compare the numeric parts
  if (numericPartA < numericPartB) {
    return -1;
  }
  if (numericPartA > numericPartB) {
    return 1;
  }
  return 0;
}

export default compareNumbers;
