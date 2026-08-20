import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { categories, treatments, employees } from "@/lib/db/schema";
import { BookingError } from "./errors";

/** Fetch the full treatment catalog (categories + treatments + employees). */
export async function getCatalog() {
  const db = getDb();

  const [allCategories, allTreatments, allEmployees] = await Promise.all([
    db
      .select()
      .from(categories)
      .where(eq(categories.active, true))
      .orderBy(categories.sortOrder),
    db.select().from(treatments).where(eq(treatments.active, true)),
    db.select().from(employees).where(eq(employees.active, true)),
  ]);

  return {
    categories: allCategories,
    treatments: allTreatments,
    employees: allEmployees,
  };
}

/** Get a single treatment by ID. Throws if not found or inactive. */
export async function getTreatmentById(treatmentId: string) {
  const db = getDb();
  const [treatment] = await db
    .select()
    .from(treatments)
    .where(eq(treatments.id, treatmentId))
    .limit(1);

  if (!treatment || !treatment.active) {
    throw new BookingError("Behandlingen blev ikke fundet.", 404, "TREATMENT_NOT_FOUND");
  }

  return treatment;
}

/** Get a single employee by ID. Throws if not found or inactive. */
export async function getEmployeeById(employeeId: string) {
  const db = getDb();
  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.id, employeeId))
    .limit(1);

  if (!employee || !employee.active) {
    throw new BookingError("Medarbejderen blev ikke fundet.", 404, "EMPLOYEE_NOT_FOUND");
  }

  return employee;
}

/** Get a single category by ID. */
export async function getCategoryById(categoryId: string) {
  const db = getDb();
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  return category ?? null;
}
