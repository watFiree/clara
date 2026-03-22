import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Terms of Service - Clara",
  description: "Terms of Service for using Clara, the wellbeing assistant.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href="/">
          <BrandLogo />
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: March 17, 2026
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
          <Section title="1. About Clara">
            <p>
              Clara is an AI-powered wellbeing assistant designed to support
              daily check-ins, self-reflection, and emotional exploration. By
              using Clara, you agree to these Terms of Service.
            </p>
          </Section>

          <Section title="2. Important Disclaimer">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="font-medium text-foreground">
                Clara is not a therapist, counselor, or medical professional.
              </p>
              <p className="mt-2">
                Clara is a wellbeing companion that uses AI to provide
                supportive, reflective conversations. It is not a substitute for
                professional mental health care, medical advice, diagnosis, or
                treatment. If you are experiencing a mental health crisis, please
                contact a qualified professional or your local emergency
                services immediately.
              </p>
            </div>
          </Section>

          <Section title="3. Eligibility">
            <p>
              You must be at least 16 years old to use Clara. By using the
              service, you represent that you meet this age requirement.
            </p>
          </Section>

          <Section title="4. Your Account">
            <p>
              You can use Clara anonymously or create an account for a
              persistent, personalised experience. If you create an account, you
              are responsible for maintaining the security of your login
              credentials.
            </p>
          </Section>

          <Section title="5. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Use Clara to generate harmful, abusive, or illegal content
              </li>
              <li>
                Attempt to exploit, reverse-engineer, or disrupt the service
              </li>
              <li>
                Impersonate others or misrepresent your identity
              </li>
              <li>
                Use automated systems to access the service beyond normal usage
              </li>
            </ul>
          </Section>

          <Section title="6. Subscriptions & Billing">
            <p>
              Clara offers free and paid subscription plans. Paid plans are
              billed monthly through Stripe.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Subscriptions renew automatically each billing cycle unless
                cancelled.
              </li>
              <li>
                You can cancel at any time through the Stripe customer portal.
                Your paid features will remain active until the end of the
                current billing period.
              </li>
              <li>
                We reserve the right to change pricing with reasonable notice.
                Existing subscriptions will not be affected until the next
                renewal.
              </li>
              <li>
                Token usage limits are enforced per plan. Exceeding your limit
                will temporarily restrict access until the next billing period or
                rolling window resets.
              </li>
            </ul>
          </Section>

          <Section title="7. Your Data">
            <p>
              You own the content you create in Clara (conversations, memories,
              settings). We do not claim any intellectual property rights over
              your content. Please refer to our{" "}
              <Link
                href="/privacy"
                className="text-primary underline underline-offset-2"
              >
                Privacy Policy
              </Link>{" "}
              for details on how your data is stored and protected.
            </p>
          </Section>

          <Section title="8. AI-Generated Content">
            <p>
              Clara&apos;s responses are generated by artificial intelligence and
              may not always be accurate, complete, or appropriate. You
              acknowledge that:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                AI responses are not professional advice of any kind
              </li>
              <li>
                You should not rely solely on Clara for important life decisions
              </li>
              <li>
                We are not liable for actions taken based on AI-generated content
              </li>
            </ul>
          </Section>

          <Section title="9. Service Availability">
            <p>
              We strive to keep Clara available at all times but do not guarantee
              uninterrupted service. We may perform maintenance, updates, or
              experience outages. We are not liable for any loss resulting from
              service unavailability.
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Clara and its creators
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the service. Our
              total liability shall not exceed the amount you paid for the
              service in the 12 months preceding the claim.
            </p>
          </Section>

          <Section title="11. Termination">
            <p>
              You may stop using Clara at any time and delete your account. We
              reserve the right to suspend or terminate accounts that violate
              these terms. Upon termination, your data will be deleted in
              accordance with our Privacy Policy.
            </p>
          </Section>

          <Section title="12. Open Source">
            <p>
              Clara&apos;s source code is available under an open-source license.
              These Terms of Service apply to the hosted service at our domain.
              Self-hosted instances are governed by the open-source license terms.
            </p>
          </Section>

          <Section title="13. Changes to These Terms">
            <p>
              We may update these terms from time to time. Material changes will
              be communicated through the application. Continued use after
              changes constitutes acceptance of the updated terms.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              If you have questions about these terms, please open an issue on
              our GitHub repository or reach out through the application.
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
