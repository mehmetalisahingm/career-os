import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="text-sm text-teal-300">CareerOS</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Hesap oluştur</h1>
        <p className="mt-2 text-sm text-slate-300">
          Başvuru takibini daha düzenli ve ölçülebilir hale getir.
        </p>

        <div className="mt-8">
          <SignupForm />
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="text-white underline underline-offset-4">
            Giriş yap
          </Link>
        </p>
      </div>
    </main>
  );
}
