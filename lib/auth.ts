import { apiRequest } from "./api";

export type SignUpInput = { name: string; email: string; password: string; rePassword: string; phone: string };
export type SignInInput = { email: string; password: string };
export type AuthResponse = { token: string; user?: { _id: string; name: string; email: string; role?: string } };

export function signUp(input: SignUpInput) {
  return apiRequest<AuthResponse>("/auth/signup", { method: "POST", body: JSON.stringify(input) });
}

export function signIn(input: SignInInput) {
  return apiRequest<AuthResponse>("/auth/signin", { method: "POST", body: JSON.stringify(input) });
}
