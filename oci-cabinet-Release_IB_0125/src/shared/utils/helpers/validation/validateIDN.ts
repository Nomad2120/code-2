import _ from 'lodash';

export const checkIIN = (iin: string) => {
  if (!iin) return false;

  if (iin?.length !== 12) return false;

  if (Number(iin[4]) > 3) return false;

  let controlSum = calculateControlSum(iin, 0);

  if (controlSum < 0) return false;

  let controlKey = controlSum % 11;

  if (controlKey === 10) {
    controlSum = calculateControlSum(iin, 2);
    if (controlSum < 0) return false;
    controlKey = controlSum % 11;
  }

  return !(controlKey === 10 || controlKey !== Number(iin[11]));
};

export const checkBIN = (iin: string) => {
  if (!iin) return false;

  if (iin?.length !== 12) return false;

  if (Number(iin[4]) < 3) return false;

  let controlSum = calculateControlSum(iin, 0);

  if (controlSum < 0) return false;

  let controlKey = controlSum % 11;

  if (controlKey === 10) {
    controlSum = calculateControlSum(iin, 2);
    if (controlSum < 0) return false;
    controlKey = controlSum % 11;
  }

  return !(controlKey === 10 || controlKey !== Number(iin[11]));
};

const calculateControlSum = (iin: string, shift: number) => {
  if (!iin) return -1;

  let sum = 0;
  const validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 11; i++) {
    if (!_.includes(validChars, iin[i])) return -1;

    let aVar = i + shift + 1;
    if (aVar > 11) aVar -= 11;
    sum += Number(iin[i]) * aVar;
  }

  return sum;
};
