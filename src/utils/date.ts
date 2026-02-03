import { parse, isValid, isAfter, isBefore, startOfDay } from 'date-fns';

export const parseDateString = (value: string, format = 'dd/MM/yyyy') => {
  const parsedDate = parse(value, format, new Date());
  return isValid(parsedDate) ? parsedDate : null;
};

export const isValidDate = (value: string | undefined): boolean => {
    if (!value) return false;
    return !!parseDateString(value);
};
