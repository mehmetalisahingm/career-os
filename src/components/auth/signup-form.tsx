"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as {
      success: boolean;
      message?: string;
    };

    if (!response.ok || !result.success) {
      setError(result.message ?? "Kayıt başarısız oldu.");
      setLoading(false);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
          Ad Soyad
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
          placeholder="Mehmet Ali"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
          placeholder="mehmet@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
          placeholder="En az 8 karakter"
        />
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-teal-300 px-4 py-3 font-medium text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Oluşturuluyor..." : "Hesap oluştur"}
      </button>
    </form>
  );
}
