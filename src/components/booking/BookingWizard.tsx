"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Scissors,
  UserRound,
} from "lucide-react";
import BookingCalendar from "@/components/booking/BookingCalendar";
import { services } from "@/data/site";
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

const stepLabels = [
  "Behandling",
  "Medarbejder",
  "Dato & tid",
  "Oplysninger",
];

const employees = [
  { id: "ahmad", name: "Ahmad" },
  { id: "frisor", name: "Frisør" },
];

export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(
    null
  );
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
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

  const selectedTreatmentObject =
    services.find((t) => t.id === selectedTreatment) ?? null;
  const selectedEmployeeObject =
    employees.find((e) => e.id === selectedEmployee) ?? null;

  // Mock fetching slots
  useEffect(() => {
    if (!selectedDate || !selectedEmployee || !selectedTreatment) {
      setAvailableSlots([]);
      return;
    }
    // Just mock some slots for the prototype
    setAvailableSlots(["10:00", "11:30", "13:00", "14:30", "16:00"]);
  }, [selectedDate, selectedEmployee, selectedTreatment]);

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    setTimeout(() => {
      stepHeadingRef.current?.focus();
    }, 50);
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

    const firstInvalidField = validateCustomer();
    if (firstInvalidField) {
      document.getElementById(`booking-${firstInvalidField}`)?.focus();
      return;
    }

    setSubmitting(true);

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For a real implementation, you'd POST this to an API endpoint that sends an email via Resend
    console.log("Booking submitted:", {
      treatment: selectedTreatmentObject?.name,
      employee: selectedEmployeeObject?.name,
      date: selectedDate,
      time: selectedTime,
      customer,
    });

    setSuccessId(`BK-${Math.floor(Math.random() * 10000)}`);
    setSubmitting(false);
    goToStep(4);
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
    setSuccessId(null);
  };

  return (
    <div className="space-y-6 md:space-y-7">
      <div className="flex items-center justify-between gap-4 text-muted-foreground">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] transition-colors hover:text-[#7B5129]"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbage til forsiden
        </Link>
      </div>

      <div className="space-y-3 text-center">
        <div className="section-label">[ Book tid ]</div>
        <div className="mx-auto max-w-[820px] space-y-3">
          <h1 className="font-serif text-[38px] leading-[0.98] tracking-[-0.04em] text-foreground sm:text-[46px] lg:text-[58px]">
            Booking hos FRISØR KBH
          </h1>
          <p className="mx-auto max-w-[760px] text-[15px] leading-[1.7] text-muted-foreground sm:text-[17px]">
            Vælg behandling, medarbejder og ledig tid — book din frisørtid på
            Vesterbrogade 171.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-border bg-card/95 shadow-[0_16px_40px_rgba(47,33,27,0.07)]">
        <nav aria-label="Booking trin">
          <ol className="grid grid-cols-2 border-b border-border md:grid-cols-4">
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
                        ? "border-[#7B5129] bg-[#7B5129] text-white"
                        : "border-border bg-background text-muted-foreground"
                    )}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px] md:text-[12px] md:tracking-[0.22em]">
                    {label}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="bg-white px-4 py-6 md:px-7 md:py-7 lg:px-8 lg:py-8">
          {step === 0 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="font-serif text-[36px] leading-none text-foreground outline-none md:text-[42px]"
                >
                  Vælg behandling
                </h2>
                <p className="mx-auto max-w-[620px] text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
                  Vælg den behandling, der passer bedst til dit besøg.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {services.map((treatment) => (
                  <button
                    key={treatment.id}
                    type="button"
                    onClick={() => chooseTreatment(treatment.id)}
                    className="rounded-[22px] border border-border bg-background px-5 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7B5129]/60 hover:shadow-[0_14px_24px_rgba(47,33,27,0.06)]"
                  >
                    <h3 className="font-serif text-[28px] leading-none text-foreground">
                      {treatment.name}
                    </h3>
                    <p className="mt-3 text-[14px] font-medium text-[#7B5129]">
                      {treatment.price}
                    </p>
                    <p className="mt-1 text-[14px] text-muted-foreground">
                      Ca. {treatment.duration}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="font-serif text-[36px] leading-none text-foreground outline-none md:text-[42px]"
                >
                  Vælg medarbejder
                </h2>
                <p className="mx-auto max-w-[620px] text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
                  Vælg den medarbejder du ønsker tid hos.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2 max-w-2xl mx-auto">
                {employees.map((employee) => (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() => chooseEmployee(employee.id)}
                    className="rounded-[22px] border border-border bg-background px-5 py-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7B5129]/60 hover:shadow-[0_14px_24px_rgba(47,33,27,0.06)]"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f6f3] text-[#7B5129]">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-[28px] leading-none text-foreground">
                      {employee.name}
                    </h3>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="font-serif text-[36px] leading-none text-foreground outline-none md:text-[42px]"
                >
                  Vælg dato & tid
                </h2>
                <p className="mx-auto max-w-[620px] text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
                  Vælg en dag i kalenderen og derefter en ledig tid.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                <BookingCalendar
                  value={selectedDate ?? undefined}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                />

                <div className="rounded-[22px] border border-border bg-background p-4 md:p-5">
                  <div className="mb-4 flex items-center gap-2.5 text-muted-foreground">
                    <Clock3 className="h-4 w-4" />
                    <span className="text-[12px] uppercase tracking-[0.16em]">
                      Ledige tider
                    </span>
                  </div>

                  {!selectedDate ? (
                    <p className="text-[14px] leading-[1.7] text-muted-foreground">
                      Vælg først en dato for at se ledige tider.
                    </p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-[14px] leading-[1.7] text-muted-foreground">
                      Ingen ledige tider på den valgte dag.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[14px] leading-[1.7] text-muted-foreground">
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
                                ? "border-[#7B5129] bg-[#7B5129] text-white"
                                : "border-border bg-background text-muted-foreground hover:border-[#7B5129]/60 hover:bg-background"
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

          {step === 3 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="font-serif text-[36px] leading-none text-foreground outline-none md:text-[42px]"
                >
                  Dine oplysninger
                </h2>
                <p className="mx-auto max-w-[620px] text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
                  Udfyld dine oplysninger for at færdiggøre bookingen.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[22px] border border-border bg-background p-5 md:p-6">
                  <h3 className="font-serif text-[28px] text-foreground">
                    Bookingoversigt
                  </h3>
                  <dl className="mt-5 space-y-3 text-[14px] leading-[1.7] text-muted-foreground">
                    <div>
                      <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                        Behandling
                      </dt>
                      <dd>{selectedTreatmentObject?.name}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                        Pris
                      </dt>
                      <dd>{selectedTreatmentObject?.price}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                        Medarbejder
                      </dt>
                      <dd>{selectedEmployeeObject?.name}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                        Dato
                      </dt>
                      <dd>
                        {selectedDate ? formatDateLabel(selectedDate) : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                        Tid
                      </dt>
                      <dd>{selectedTime}</dd>
                    </div>
                  </dl>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="grid gap-4 rounded-[22px] border border-border bg-background p-5 md:p-6"
                >
                  <label className="grid gap-2">
                    <span className="text-[14px] font-medium text-muted-foreground">
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
                        setCustomer((current) => ({
                          ...current,
                          name: event.target.value,
                        }));
                      }}
                      className="rounded-[14px] border border-border px-4 py-2.5 text-foreground outline-none transition-colors focus:border-[#7B5129]"
                    />
                    {fieldErrors.name ? (
                      <span
                        id="booking-name-error"
                        className="text-[13px] text-[#a45445]"
                      >
                        {fieldErrors.name}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[14px] font-medium text-muted-foreground">
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
                        setCustomer((current) => ({
                          ...current,
                          phone: event.target.value,
                        }));
                      }}
                      className="rounded-[14px] border border-border px-4 py-2.5 text-foreground outline-none transition-colors focus:border-[#7B5129]"
                    />
                    {fieldErrors.phone ? (
                      <span
                        id="booking-phone-error"
                        className="text-[13px] text-[#a45445]"
                      >
                        {fieldErrors.phone}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[14px] font-medium text-muted-foreground">
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
                        setCustomer((current) => ({
                          ...current,
                          email: event.target.value,
                        }));
                      }}
                      className="rounded-[14px] border border-border px-4 py-2.5 text-foreground outline-none transition-colors focus:border-[#7B5129]"
                    />
                    {fieldErrors.email ? (
                      <span
                        id="booking-email-error"
                        className="text-[13px] text-[#a45445]"
                      >
                        {fieldErrors.email}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[14px] font-medium text-muted-foreground">
                      Noter
                    </span>
                    <textarea
                      id="booking-notes"
                      value={customer.notes}
                      onChange={(event) =>
                        setCustomer((current) => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                      rows={4}
                      className="rounded-[14px] border border-border px-4 py-2.5 text-foreground outline-none transition-colors focus:border-[#7B5129]"
                    />
                  </label>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border bg-background px-6 text-[15px] font-medium transition-colors hover:bg-card"
                    >
                      Tilbage
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#7B5129] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#684322] disabled:cursor-wait disabled:opacity-70"
                    >
                      {submitting ? "Bekræfter..." : "Bekræft booking"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf7ee] text-[#4d8c55]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="font-serif text-[36px] leading-none text-foreground outline-none md:text-[42px]"
                >
                  Booking bekræftet
                </h2>
                <p className="mx-auto max-w-[640px] text-[15px] leading-[1.7] text-muted-foreground md:text-[16px]">
                  Tak for din booking! Vi har modtaget din forespørgsel og glæder os til at se dig i salonen.
                </p>
              </div>
              <div className="mx-auto max-w-[640px] rounded-[22px] border border-border bg-background p-5 text-left md:p-6">
                <p className="mb-4 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                  Booking ID
                </p>
                <p className="mb-6 text-[16px] text-muted-foreground">
                  {successId}
                </p>
                <dl className="grid gap-4 sm:grid-cols-2 text-[15px] leading-[1.7] text-muted-foreground">
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                      Behandling
                    </dt>
                    <dd>{selectedTreatmentObject?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                      Pris
                    </dt>
                    <dd>{selectedTreatmentObject?.price}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                      Medarbejder
                    </dt>
                    <dd>{selectedEmployeeObject?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                      Dato
                    </dt>
                    <dd>
                      {selectedDate ? formatDateLabel(selectedDate) : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                      Tid
                    </dt>
                    <dd>{selectedTime}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                      Navn
                    </dt>
                    <dd>{customer.name}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-border bg-background px-6 text-[15px] font-medium transition-colors hover:bg-card"
                >
                  Opret ny booking
                </button>
                <Link
                  href="/"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#7B5129] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#684322]"
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
