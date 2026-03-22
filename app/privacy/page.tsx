import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Privacy Policy - Clara",
  description: "Learn how Clara protects your data and respects your privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href="/">
          <BrandLogo />
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: March 17, 2026
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
          <Section title="1. Introduction">
            <p>
              Clara (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is an
              open-source, privacy-first wellbeing assistant. We are committed to
              protecting your personal data and being transparent about how it is
              handled. This Privacy Policy explains what data we collect, how we
              use it, and the choices you have.
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p>We collect only what is necessary to provide the service:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Account information</strong>{" "}
                — If you sign in, we receive your name and email from our
                authentication provider (WorkOS). We do not store passwords.
              </li>
              <li>
                <strong className="text-foreground">Conversations</strong> — The
                messages you exchange with Clara are stored in our database so
                you can return to them later.
              </li>
              <li>
                <strong className="text-foreground">Memories</strong> — Facts and
                patterns Clara learns about you are encrypted with a unique
                per-user key using AES-256-GCM before storage. They cannot be
                read without your key.
              </li>
              <li>
                <strong className="text-foreground">Usage data</strong> — We
                track token consumption (aggregated daily, per model) to enforce
                plan limits. We do not track page views, clicks, or behavior.
              </li>
              <li>
                <strong className="text-foreground">Settings</strong> — Your
                preferences (name, language, tone, focus areas) are stored to
                personalise your experience.
              </li>
              <li>
                <strong className="text-foreground">Payment information</strong>{" "}
                — Billing is handled entirely by Stripe. We store your Stripe
                customer ID and subscription status but never see or store your
                card details.
              </li>
            </ul>
          </Section>

          <Section title="3. How We Protect Your Data">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Memories are encrypted end-to-end with AES-256-GCM using a
                unique key per user. The key itself is encrypted with a server
                master key.
              </li>
              <li>
                Embedding vectors used for memory search are sign-flipped with a
                per-user random vector, preventing reverse-engineering of content
                from embeddings alone.
              </li>
              <li>
                All communication between your browser and our servers is
                encrypted via HTTPS/TLS.
              </li>
              <li>
                The codebase is open source — you can inspect exactly how your
                data is processed.
              </li>
            </ul>
          </Section>

          <Section title="4. Third-Party Services">
            <p>Clara uses the following third-party services:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">OpenAI</strong> — Your
                messages are sent to OpenAI&apos;s API to generate responses.
                OpenAI&apos;s data usage policies apply to these interactions.
              </li>
              <li>
                <strong className="text-foreground">Stripe</strong> — Handles
                payment processing. Stripe&apos;s privacy policy governs how
                they handle your payment information.
              </li>
              <li>
                <strong className="text-foreground">WorkOS</strong> — Provides
                authentication. WorkOS receives only the minimum data needed for
                sign-in.
              </li>
            </ul>
          </Section>

          <Section title="5. Cookies">
            <p>
              We use a minimal set of cookies strictly necessary for the service
              to function:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Session cookie</strong> —
                Keeps you signed in.
              </li>
              <li>
                <strong className="text-foreground">Anonymous ID cookie</strong>{" "}
                — If you use Clara without signing in, a cookie identifies your
                anonymous session so conversations persist.
              </li>
            </ul>
            <p className="mt-3">
              We do not use analytics cookies, advertising cookies, or any
              third-party tracking.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              Your data is retained for as long as your account exists. If you
              delete your account, all associated data (conversations, memories,
              settings, usage records) will be permanently deleted. You can also
              delete individual conversations or memories at any time.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Access the data we hold about you</li>
              <li>Request deletion of your data</li>
              <li>Export your conversations and memories</li>
              <li>Withdraw consent at any time by deleting your account</li>
            </ul>
          </Section>

          <Section title="8. Self-Hosting">
            <p>
              Clara is open source. You can self-host the entire application,
              meaning your data never leaves your own infrastructure. When
              self-hosted, no data is shared with us.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this policy from time to time. If we make material
              changes, we will notify you through the application. Continued use
              after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              If you have questions about this privacy policy or your data,
              please open an issue on our GitHub repository or reach out through
              the application.
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
