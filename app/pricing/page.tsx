import { BrandLogo } from "@/components/brand-logo";
import { getUser } from "@/lib/auth";
import { getPlans } from "@/lib/stripe/helpers";
import { PricingCards } from "./pricing-cards";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const [plans, user] = await Promise.all([getPlans(), getUser()]);
  const isLocalUser = !user || user.authProvider === "local";

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-16">
      <div className="mb-8">
        <BrandLogo />
      </div>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Choose your plan
      </h1>
      <p className="mt-3 max-w-md text-center text-muted-foreground">
        Start free and upgrade when you need more support from Clara
      </p>

      <PricingCards plans={plans} isLocalUser={isLocalUser} />
    </div>
  );
}
