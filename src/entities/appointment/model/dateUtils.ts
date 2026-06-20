import type { Appointment } from "./types";

export const getTodayValue = () => new Date().toISOString().slice(0, 10);

export const isPastVisitTime = (date: string, time: string) =>
  date === getTodayValue() && time <= new Date().toTimeString().slice(0, 5);

export const sortByVisitStart = (items: Appointment[]) =>
  [...items].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
