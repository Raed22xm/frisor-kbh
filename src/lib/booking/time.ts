/** Convert "HH:MM" to total minutes since midnight. */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Convert total minutes since midnight to "HH:MM". */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Generate time slots from startHour to endHour at the given interval. */
export function createTimeSlots(
  startHour: number,
  endHour: number,
  intervalMinutes: number
): string[] {
  const slots: string[] = [];
  const startMinutes = startHour * 60;
  const endMinutes = endHour * 60;

  for (let m = startMinutes; m < endMinutes; m += intervalMinutes) {
    slots.push(minutesToTime(m));
  }

  return slots;
}

/** Check if two time ranges overlap. */
export function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && startB < endA;
}
