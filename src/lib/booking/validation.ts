import { z } from "zod";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}$/;

export function isValidDateKey(date: string): boolean {
  return DATE_REGEX.test(date);
}

export function isValidTimeKey(time: string): boolean {
  return TIME_REGEX.test(time);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return phone.replace(/[^0-9]/g, "").length >= 8;
}

/** Zod schema for the POST /api/bookings request body. */
export const createBookingSchema = z.object({
  treatmentId: z.string().min(1),
  employeeId: z.string().min(1),
  date: z.string().regex(DATE_REGEX, "Ugyldig dato (YYYY-MM-DD)."),
  time: z.string().regex(TIME_REGEX, "Ugyldigt tidspunkt (HH:MM)."),
  customerName: z.string().min(1, "Navn er påkrævet."),
  customerPhone: z.string().min(1, "Telefonnummer er påkrævet."),
  customerEmail: z.string().email("E-mailadressen er ugyldig."),
  notes: z.string().optional().default(""),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

/** Zod schema for the GET /api/availability query params. */
export const availabilityQuerySchema = z.object({
  date: z.string().regex(DATE_REGEX, "Ugyldig dato."),
  employeeId: z.string().min(1),
  treatmentId: z.string().min(1),
});
