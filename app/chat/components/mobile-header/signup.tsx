import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

export const SignUp = () => (
  <Button asChild>
    <Link href="/auth/login">
      <LogInIcon className="size-4" />
      Get Full Access
    </Link>
  </Button>
);
