import type { Metadata } from "next";
import { AuthExperience } from "@/app/components/AuthExperience";

export const metadata: Metadata = {
  title: "Sign In | FreshCart",
  description: "Sign in to your FreshCart account.",
};

export default function LoginPage() {
  return <AuthExperience mode="login" />;
}
