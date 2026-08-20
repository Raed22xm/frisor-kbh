import { createTimeSlots, timeToMinutes } from "./time";
import { isValidDateKey, isValidTimeKey } from "./validation";

export const BOOKING_TIME_ZONE = "Europe/Copenhagen";
export const BOOKING_INTERVAL_MINUTES = 20;

export type BusinessHours = {
  startHour: number;
  endHour: number;
};

/** Returns business hours for a given date, or null if closed (e.g. Sunday). */
export function getBusinessHoursForDate(date: string): BusinessHours | null {
  if (!isValidDateKey(date)) return null;

  const dayOfWeek = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (dayOfWeek === 0) return null; // Sunday — closed
  if (dayOfWeek === 6) return { startHour: 9, endHour: 15 }; // Saturday — short day
  return { startHour: 9, endHour: 18 }; // Weekdays
}

/** Get today's date key in Copenhagen timezone. */
export function getDateKeyInTimeZone(
  now = new Date(),
  timeZone = BOOKING_TIME_ZONE
): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );
  return `${values.year}-${values.month}-${values.day}`;
}

/** Check if a date is in the past relative to Copenhagen time. */
export function isPastBookingDate(date: string, now = new Date()): boolean {
  return isValidDateKey(date) && date < getDateKeyInTimeZone(now);
}

/** Generate all bookable time slots for a date, given a treatment duration. */
export function createBookableSlots(
  date: string,
  durationMinutes: number,
  intervalMinutes = BOOKING_INTERVAL_MINUTES
): string[] {
  const hours = getBusinessHoursForDate(date);
  if (!hours || durationMinutes <= 0 || intervalMinutes <= 0) return [];

  return createTimeSlots(
    hours.startHour,
    hours.endHour,
    intervalMinutes
  ).filter(
    (slot) => timeToMinutes(slot) + durationMinutes <= hours.endHour * 60
  );
}

/** Check if a given start time is a valid bookable slot. */
export function isBookableStartTime(
  date: string,
  time: string,
  durationMinutes: number,
  intervalMinutes = BOOKING_INTERVAL_MINUTES
): boolean {
  if (!isWithinBusinessHours(date, time, durationMinutes)) return false;
  return timeToMinutes(time) % intervalMinutes === 0;
}

/** Check if a booking fits within business hours. */
export function isWithinBusinessHours(
  date: string,
  time: string,
  durationMinutes: number
): boolean {
  if (!isValidDateKey(date) || !isValidTimeKey(time)) return false;
  const hours = getBusinessHoursForDate(date);
  if (!hours || durationMinutes <= 0) return false;

  const start = timeToMinutes(time);
  return (
    start >= hours.startHour * 60 &&
    start + durationMinutes <= hours.endHour * 60
  );
}
