import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="text-sm text-teal-300">CareerOS</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Tekrar hoş geldin</h1>
        <p className="mt-2 text-sm text-slate-300">
          Başvurularını yönetmek için hesabına giriş yap.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Hesabın yok mu?{" "}
          <Link href="/signup" className="text-white underline underline-offset-4">
            Kayıt ol
          </Link>
        </p>
      </div>
    </main>
  );
}
