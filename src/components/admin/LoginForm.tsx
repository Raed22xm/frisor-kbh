"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { login } from "@/app/login/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="admin-email" className="text-sm font-semibold text-gray-700">E-mail</label>
        <div className="relative mt-1.5">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input id="admin-email" name="email" type="email" autoComplete="username" required defaultValue="frisorkbh@hotmail.com" className="min-h-12 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20" />
        </div>
      </div>

      <div>
        <label htmlFor="admin-password" className="text-sm font-semibold text-gray-700">Adgangskode</label>
        <div className="relative mt-1.5">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required minLength={8} className="min-h-12 w-full rounded-lg border border-gray-300 pl-10 pr-12 text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20" />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Skjul adgangskode" : "Vis adgangskode"} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {state?.error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</p> : null}

      <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
        {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Logger ind…" : "Log ind"}
      </button>
    </form>
  );
}
