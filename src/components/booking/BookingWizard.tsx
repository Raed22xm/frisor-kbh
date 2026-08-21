"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  UserRound,
} from "lucide-react";
import BookingCalendar from "@/components/booking/BookingCalendar";
import {
  formatDateLabel,
  isValidEmail,
  isValidPhone,
} from "@/lib/booking-utils";
import { cn } from "@/lib/utils";

type CustomerState = {
  name: string;
  phone: string;
  email: string;
  notes: string;
};

type Category = { id: string; name: string; description: string };
type Treatment = {
  id: string;
  categoryId: string;
  name: string;
  durationMinutes: number;
  price: string;
};
type Employee = { id: string; name: string };
type Catalog = {
  categories: Category[];
  treatments: Treatment[];
  employees: Employee[];
};

const stepLabels = ["Behandling", "Medarbejder", "Dato & tid", "Oplysninger"];

export default function BookingWizard() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [step, setStep] = useState(0);
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerState>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CustomerState, string>>
  >({});
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);

  // ── Fetch catalog on mount ──
  useEffect(() => {
    let cancelled = false;
    setLoadingCatalog(true);
    setError(null);

    fetch("/api/services", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Kunne ikke hente behandlinger.");
        return response.json() as Promise<Catalog>;
      })
      .then((payload) => {
        if (!cancelled) setCatalog(payload);
      })
      .catch((fetchError: Error) => {
        if (!cancelled) setError(fetchError.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingCatalog(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const allTreatments = useMemo(() => catalog?.treatments ?? [], [catalog]);
  const allEmployees = useMemo(() => catalog?.employees ?? [], [catalog]);

  const selectedTreatmentObject = useMemo(
    () => allTreatments.find((t) => t.id === selectedTreatment) ?? null,
    [allTreatments, selectedTreatment]
  );
  const selectedEmployeeObject = useMemo(
    () => allEmployees.find((e) => e.id === selectedEmployee) ?? null,
    [allEmployees, selectedEmployee]
  );

  // ── Fetch available slots when date/employee/treatment change ──
  useEffect(() => {
    if (!selectedDate || !selectedEmployee || !selectedTreatment) {
      setAvailableSlots([]);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);
    setError(null);

    fetch(
      `/api/availability?date=${encodeURIComponent(selectedDate)}&employeeId=${encodeURIComponent(selectedEmployee)}&treatmentId=${encodeURIComponent(selectedTreatment)}`,
      { cache: "no-store" }
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("Kunne ikke hente ledige tider.");
        return response.json();
      })
      .then((payload) => {
        if (!cancelled) {
          setAvailableSlots(Array.isArray(payload.slots) ? payload.slots : []);
        }
      })
      .catch((fetchError: Error) => {
        if (!cancelled) {
          setAvailableSlots([]);
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, selectedEmployee, selectedTreatment]);

  useEffect(() => {
    if (!loadingCatalog) stepHeadingRef.current?.focus();
  }, [step, loadingCatalog]);

  useEffect(() => {
    if (error) errorAlertRef.current?.focus();
  }, [error]);

  const goToStep = (nextStep: number) => {
    setError(null);
    setStep(nextStep);
  };

  const chooseTreatment = (treatmentId: string) => {
    setSelectedTreatment(treatmentId);
    setSelectedEmployee(null);
    setSelectedDate(null);
    setSelectedTime(null);
    goToStep(1);
  };

  const chooseEmployee = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setSelectedDate(null);
    setSelectedTime(null);
    goToStep(2);
  };

  const validateCustomer = (): keyof CustomerState | null => {
    const nextErrors: Partial<Record<keyof CustomerState, string>> = {};
    if (!customer.name.trim()) nextErrors.name = "Skriv dit navn.";
    if (!customer.phone.trim()) nextErrors.phone = "Skriv dit telefonnummer.";
    else if (!isValidPhone(customer.phone))
      nextErrors.phone = "Telefonnummeret ser ikke rigtigt ud.";
    if (!customer.email.trim()) nextErrors.email = "Skriv din e-mail.";
    if (customer.email.trim() && !isValidEmail(customer.email))
      nextErrors.email = "E-mailen ser ikke rigtigt ud.";

    setFieldErrors(nextErrors);
    const invalidFields: (keyof CustomerState)[] = ["name", "phone", "email"];
    return invalidFields.find((field) => nextErrors[field]) ?? null;
  };

  const clearFieldError = (field: keyof CustomerState) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!selectedTreatmentObject || !selectedEmployeeObject || !selectedDate || !selectedTime) {
      setError("Bookingflowet mangler valg. Start fra toppen.");
      return;
    }

    const firstInvalidField = validateCustomer();
    if (firstInvalidField) {
      document.getElementById(`booking-${firstInvalidField}`)?.focus();
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatmentId: selectedTreatmentObject.id,
          employeeId: selectedEmployeeObject.id,
          date: selectedDate,
          time: selectedTime,
          customerName: customer.name.trim(),
          customerPhone: customer.phone.trim(),
          customerEmail: customer.email.trim(),
          notes: customer.notes.trim(),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Booking kunne ikke gennemføres.");
      }

      setSuccessId(payload.booking?.id ?? "OK");
      goToStep(4);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Booking kunne ikke gennemføres."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(0);
    setSelectedTreatment(null);
    setSelectedEmployee(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableSlots([]);
    setCustomer({ name: "", phone: "", email: "", notes: "" });
    setFieldErrors({});
    setError(null);
    setSuccessId(null);
  };

  return (
    <div className="space-y-6 md:space-y-7">
      <div className="flex items-center justify-between gap-4 text-gray-500">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbage til forsiden
        </Link>
      </div>

      <div className="space-y-3 text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-emerald-600">
          [ Book tid ]
        </div>
        <div className="mx-auto max-w-[820px] space-y-3">
          <h1 className="text-[38px] font-bold leading-[0.98] tracking-[-0.04em] text-gray-900 sm:text-[46px] lg:text-[58px]">
            Booking hos FRISØR KBH
          </h1>
          <p className="mx-auto max-w-[760px] text-[15px] leading-[1.7] text-gray-500 sm:text-[17px]">
            Vælg behandling, medarbejder og ledig tid — book din frisørtid på
            Vesterbrogade 171.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-lg ">
        <nav aria-label="Booking trin">
          <ol className="grid grid-cols-2 border-b border-gray-200 md:grid-cols-4">
            {stepLabels.map((label, index) => {
              const active = step === index;
              const completed = step > index || step === 4;
              return (
                <li
                  key={label}
                  aria-current={active ? "step" : undefined}
                  className="flex flex-col items-center gap-2 px-3 py-4 text-center md:gap-3 md:px-4 md:py-5"
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full border text-[15px] font-semibold transition-all md:h-12 md:w-12 md:text-[16px]",
                      active || completed
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-gray-200 bg-white text-gray-500"
                    )}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 sm:text-[11px] md:text-[12px] md:tracking-[0.22em]">
                    {label}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="px-4 py-6 md:px-7 md:py-7 lg:px-8 lg:py-8">
          {error ? (
            <div
              ref={errorAlertRef}
              role="alert"
              tabIndex={-1}
              className="mb-6 rounded-[18px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-[14px] text-red-400 outline-none"
            >
              {error}
            </div>
          ) : null}

          {loadingCatalog ? (
            <p
              className="py-10 text-center text-[15px] text-gray-500"
              aria-live="polite"
            >
              Henter behandlinger...
            </p>
          ) : null}

          {!loadingCatalog && !catalog ? (
            <p className="py-10 text-center text-[15px] text-red-400" role="alert">
              Behandlinger kunne ikke indlæses. Prøv igen senere.
            </p>
          ) : null}

          {/* ── Step 0: Choose Treatment ── */}
          {!loadingCatalog && catalog && step === 0 ? (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="text-[36px] font-bold leading-none text-gray-900 outline-none md:text-[42px]"
                >
                  Vælg behandling
                </h2>
                <p className="mx-auto max-w-[620px] text-[15px] leading-[1.7] text-gray-500 md:text-[16px]">
                  Vælg den behandling, der passer bedst til dit besøg.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {allTreatments.map((treatment) => (
                  <button
                    key={treatment.id}
                    type="button"
                    onClick={() => chooseTreatment(treatment.id)}
                    className="rounded-[22px] border border-gray-200 bg-white px-5 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-600/60 hover:shadow-md"
                  >
                    <h3 className="text-[24px] font-bold leading-none text-gray-900 md:text-[28px]">
                      {treatment.name}
                    </h3>
                    <p className="mt-3 text-[14px] font-medium text-emerald-600">
                      {treatment.price}
                    </p>
                    <p className="mt-1 text-[14px] text-gray-500">
                      Ca. {treatment.durationMinutes} min
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* ── Step 1: Choose Employee ── */}
          {!loadingCatalog && catalog && step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="text-[36px] font-bold leading-none text-gray-900 outline-none md:text-[42px]"
                >
                  Vælg medarbejder
                </h2>
                <p className="mx-auto max-w-[620px] text-[15px] leading-[1.7] text-gray-500 md:text-[16px]">
                  Vælg den medarbejder du ønsker tid hos.
                </p>
              </div>
              <div className="mx-auto grid max-w-2xl gap-3 md:grid-cols-2">
                {allEmployees.map((employee) => (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() => chooseEmployee(employee.id)}
                    className="rounded-[22px] border border-gray-200 bg-white px-5 py-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-600/60 hover:shadow-md"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <h3 className="text-[24px] font-bold leading-none text-gray-900 md:text-[28px]">
                      {employee.name}
                    </h3>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* ── Step 2: Choose Date & Time ── */}
          {!loadingCatalog && catalog && step === 2 ? (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="text-[36px] font-bold leading-none text-gray-900 outline-none md:text-[42px]"
                >
                  Vælg dato & tid
                </h2>
                <p className="mx-auto max-w-[620px] text-[15px] leading-[1.7] text-gray-500 md:text-[16px]">
                  Vælg en dag i kalenderen og derefter en ledig tid.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                <BookingCalendar
                  value={selectedDate ?? undefined}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                    setError(null);
                  }}
                />

                <div className="rounded-[22px] border border-gray-200 bg-white p-4 md:p-5">
                  <div className="mb-4 flex items-center gap-2.5 text-gray-500">
                    <Clock3 className="h-4 w-4" />
                    <span className="text-[12px] uppercase tracking-[0.16em]">
                      Ledige tider
                    </span>
                  </div>

                  {!selectedDate ? (
                    <p className="text-[14px] leading-[1.7] text-gray-500">
                      Vælg først en dato for at se ledige tider.
                    </p>
                  ) : loadingSlots ? (
                    <p className="text-[14px] leading-[1.7] text-gray-500">
                      Henter ledige tider...
                    </p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-[14px] leading-[1.7] text-gray-500">
                      Ingen ledige tider på den valgte dag.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[14px] leading-[1.7] text-gray-500">
                        {formatDateLabel(selectedDate)}
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setSelectedTime(slot);
                              goToStep(3);
                            }}
                            className={cn(
                              "rounded-[14px] border px-3.5 py-2.5 text-[14px] font-medium transition-all",
                              selectedTime === slot
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-gray-200 bg-white text-gray-500 hover:border-emerald-600/60"
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* ── Step 3: Customer Details ── */}
          {!loadingCatalog && catalog && step === 3 ? (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="text-[36px] font-bold leading-none text-gray-900 outline-none md:text-[42px]"
                >
                  Dine oplysninger
                </h2>
                <p className="mx-auto max-w-[620px] text-[15px] leading-[1.7] text-gray-500 md:text-[16px]">
                  Udfyld dine oplysninger for at færdiggøre bookingen.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[22px] border border-gray-200 bg-white p-5 md:p-6">
                  <h3 className="text-[24px] font-bold text-gray-900">
                    Bookingoversigt
                  </h3>
                  <dl className="mt-5 space-y-3 text-[14px] leading-[1.7] text-gray-500">
                    <div>
                      <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                        Behandling
                      </dt>
                      <dd className="text-gray-900">{selectedTreatmentObject?.name}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                        Pris
                      </dt>
                      <dd className="text-gray-900">{selectedTreatmentObject?.price}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                        Medarbejder
                      </dt>
                      <dd className="text-gray-900">{selectedEmployeeObject?.name}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                        Dato
                      </dt>
                      <dd className="text-gray-900">
                        {selectedDate ? formatDateLabel(selectedDate) : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                        Tid
                      </dt>
                      <dd className="text-gray-900">{selectedTime}</dd>
                    </div>
                  </dl>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="grid gap-4 rounded-[22px] border border-gray-200 bg-white p-5 md:p-6"
                >
                  <label className="grid gap-2">
                    <span className="text-[14px] font-medium text-gray-500">
                      Navn
                    </span>
                    <input
                      id="booking-name"
                      autoComplete="name"
                      required
                      value={customer.name}
                      aria-invalid={fieldErrors.name ? true : undefined}
                      aria-describedby={
                        fieldErrors.name ? "booking-name-error" : undefined
                      }
                      onChange={(event) => {
                        clearFieldError("name");
                        setCustomer((c) => ({ ...c, name: event.target.value }));
                      }}
                      className="rounded-[14px] border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-emerald-600"
                    />
                    {fieldErrors.name ? (
                      <span id="booking-name-error" className="text-[13px] text-red-400">
                        {fieldErrors.name}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[14px] font-medium text-gray-500">
                      Telefon
                    </span>
                    <input
                      id="booking-phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={customer.phone}
                      aria-invalid={fieldErrors.phone ? true : undefined}
                      aria-describedby={
                        fieldErrors.phone ? "booking-phone-error" : undefined
                      }
                      onChange={(event) => {
                        clearFieldError("phone");
                        setCustomer((c) => ({ ...c, phone: event.target.value }));
                      }}
                      className="rounded-[14px] border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-emerald-600"
                    />
                    {fieldErrors.phone ? (
                      <span id="booking-phone-error" className="text-[13px] text-red-400">
                        {fieldErrors.phone}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[14px] font-medium text-gray-500">
                      E-mail
                    </span>
                    <input
                      id="booking-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={customer.email}
                      aria-invalid={fieldErrors.email ? true : undefined}
                      aria-describedby={
                        fieldErrors.email ? "booking-email-error" : undefined
                      }
                      onChange={(event) => {
                        clearFieldError("email");
                        setCustomer((c) => ({ ...c, email: event.target.value }));
                      }}
                      className="rounded-[14px] border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-emerald-600"
                    />
                    {fieldErrors.email ? (
                      <span id="booking-email-error" className="text-[13px] text-red-400">
                        {fieldErrors.email}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[14px] font-medium text-gray-500">
                      Noter
                    </span>
                    <textarea
                      id="booking-notes"
                      value={customer.notes}
                      onChange={(event) =>
                        setCustomer((c) => ({ ...c, notes: event.target.value }))
                      }
                      rows={4}
                      className="rounded-[14px] border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-emerald-600"
                    />
                  </label>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-[15px] font-medium transition-colors hover:bg-gray-50"
                    >
                      Tilbage
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-emerald-600 px-6 text-[15px] font-medium text-white transition-colors hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                    >
                      {submitting ? "Bekræfter..." : "Bekræft booking"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}

          {/* ── Step 4: Success ── */}
          {step === 4 ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="text-[36px] font-bold leading-none text-gray-900 outline-none md:text-[42px]"
                >
                  Booking bekræftet
                </h2>
                <p className="mx-auto max-w-[640px] text-[15px] leading-[1.7] text-gray-500 md:text-[16px]">
                  Tak for din booking! Vi har sendt en bekræftelse til{" "}
                  <strong className="text-gray-900">{customer.email}</strong>.
                </p>
              </div>
              <div className="mx-auto max-w-[640px] rounded-[22px] border border-gray-200 bg-white p-5 text-left md:p-6">
                <p className="mb-4 text-[12px] uppercase tracking-[0.18em] text-gray-500">
                  Booking ID
                </p>
                <p className="mb-6 text-[16px] text-gray-500">{successId}</p>
                <dl className="grid gap-4 text-[15px] leading-[1.7] text-gray-500 sm:grid-cols-2">
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                      Behandling
                    </dt>
                    <dd className="text-gray-900">{selectedTreatmentObject?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                      Pris
                    </dt>
                    <dd className="text-gray-900">{selectedTreatmentObject?.price}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                      Medarbejder
                    </dt>
                    <dd className="text-gray-900">{selectedEmployeeObject?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                      Dato
                    </dt>
                    <dd className="text-gray-900">
                      {selectedDate ? formatDateLabel(selectedDate) : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                      Tid
                    </dt>
                    <dd className="text-gray-900">{selectedTime}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                      Navn
                    </dt>
                    <dd className="text-gray-900">{customer.name}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-[15px] font-medium transition-colors hover:bg-gray-50"
                >
                  Opret ny booking
                </button>
                <Link
                  href="/"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-emerald-600 px-6 text-[15px] font-medium text-white transition-colors hover:brightness-110"
                >
                  Tilbage til forsiden
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
