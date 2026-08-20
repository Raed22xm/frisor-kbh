export class BookingError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 400, code = "BOOKING_ERROR") {
    super(message);
    this.name = "BookingError";
    this.statusCode = statusCode;
    this.code = code;
  }
}
