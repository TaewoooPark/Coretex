import Link from "next/link";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalInput } from "@/components/brutal/BrutalInput";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4">
      <section className="w-full max-w-md border-4 border-black bg-white shadow-hardLg">
        <header className="border-b-4 border-black bg-black px-5 py-4 text-white">
          <h1 className="text-2xl uppercase">CORETEX</h1>
          <p className="mt-1 text-xs uppercase">Sign in placeholder</p>
        </header>
        <form className="space-y-3 p-5" action="/api/auth/demo" method="post">
          <BrutalInput defaultValue="taewoo@example.com" />
          <BrutalButton variant="inverse" className="w-full" type="submit">
            Continue
          </BrutalButton>
          <Link className="block text-xs uppercase underline" href="/auth/sign-up">
            Need an account?
          </Link>
        </form>
      </section>
    </main>
  );
}
