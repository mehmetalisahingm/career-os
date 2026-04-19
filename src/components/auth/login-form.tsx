import { signIn } from "@/auth";

export function LoginForm() {
  return (
    <form
      action={async (formData) => {
        "use server";

        const email = formData.get("email");
        const password = formData.get("password");

        await signIn("credentials", {
          email,
          password,
          redirectTo: "/dashboard",
        });
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
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
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-teal-300 px-4 py-3 font-medium text-slate-950 transition hover:opacity-90"
      >
        Giriş yap
      </button>
    </form>
  );
}
