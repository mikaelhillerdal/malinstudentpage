"use client";

import { useFormState } from "react-dom";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { ok: false };

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="grid gap-3">
      <label className="grid gap-1 text-sm">
        <span className="text-zinc-700">Email</span>
        <input name="email" type="email" required className="rounded-2xl border px-4 py-3" />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="text-zinc-700">Password</span>
        <input name="password" type="password" required className="rounded-2xl border px-4 py-3" />
      </label>

      <button className="mt-2 rounded-2xl bg-zinc-900 px-5 py-3 text-white shadow-sm hover:opacity-90">
        Log in
      </button>

      {state?.message ? (
        <p className={`text-sm ${state.ok ? "text-green-700" : "text-red-700"}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
