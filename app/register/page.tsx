'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { signUp } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await signUp({ fullName, email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Account created successfully. Redirecting to your dashboard...");
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/40">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold text-white">Create Account</h1>
          <p className="text-sm text-slate-400">
            Start using DocMind AI for secure document chat and summaries.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <TextInput label="Full name" type="text" placeholder="Your full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <TextInput label="Email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          <TextInput label="Password" type="password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        {message ? <p className="mt-4 text-center text-sm text-emerald-400">{message}</p> : null}
        {error ? <p className="mt-4 text-center text-sm text-red-400">{error}</p> : null}

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
