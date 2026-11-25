import type { Metadata } from "next";
import { AuthExperience } from "@/app/components/AuthExperience";

export const metadata: Metadata = {
  title: "Create an Account | FreshCart",
  description: "Create your FreshCart account and start shopping.",
};

export default function SignUpPage() {
  return <AuthExperience mode="signup" />;
}
