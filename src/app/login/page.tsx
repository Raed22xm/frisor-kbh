import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Scissors } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Admin login | FRISØR KBH",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(5,150,105,0.18),transparent_45%)]" aria-hidden="true" />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
        <div className="bg-gray-950 px-8 py-7 text-center text-white">
          <Link href="/" className="inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300"><Scissors className="h-5 w-5" aria-hidden="true" /></span>
            <span className="text-xl font-bold tracking-tight">FRISØR KBH</span>
          </Link>
          <h1 className="mt-5 text-2xl font-bold">Administratorlogin</h1>
          <p className="mt-2 text-sm text-gray-400">Log ind for at administrere bookinger, behandlinger og galleri.</p>
        </div>
        <div className="p-8">
          <LoginForm />
          <p className="mt-6 text-center text-xs text-gray-500">Kun autoriserede administratorer har adgang.</p>
        </div>
      </div>
    </main>
  );
}
