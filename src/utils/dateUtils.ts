
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

// Date formatting utilities
export const formatDisplayDate = (date: Date): string => {
  return format(date, "MMMM d, yyyy");
};

export const formatDisplayDateFr = (date: Date): string => {
  return format(date, "d MMMM yyyy", { locale: fr });
};

export const formatISODate = (date: Date): string => {
  return date.toISOString();
};

// Date range utilities
export const calculateNights = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const areOverlappingDateRanges = (
  startDate1: Date,
  endDate1: Date,
  startDate2: Date,
  endDate2: Date
): boolean => {
  return startDate1 <= endDate2 && endDate1 >= startDate2;
};

export const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
