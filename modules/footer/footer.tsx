import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
      <p>
        Clara is a wellbeing companion, not a therapist. If you&apos;re in
        crisis, please reach out to a professional.
      </p>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <Link
          href="/privacy"
          className="underline-offset-2 hover:underline hover:text-foreground transition-colors"
        >
          Privacy Policy
        </Link>
        <span>&middot;</span>
        <Link
          href="/terms"
          className="underline-offset-2 hover:underline hover:text-foreground transition-colors"
        >
          Terms of Service
        </Link>
        <span>&middot;</span>
        <Link
          href="/pricing"
          className="underline-offset-2 hover:underline hover:text-foreground transition-colors"
        >
          Pricing
        </Link>
      </div>
      <p className="mt-3 text-xs">
        Open source &middot; Privacy-first &middot; Made with care
      </p>
    </footer>
  );
}
