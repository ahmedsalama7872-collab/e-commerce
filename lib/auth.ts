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

export function forgotPasswords(email: string) {
  return apiRequest<{ statusMsg?: string; message?: string }>("/auth/forgotPasswords", { method: "POST", body: JSON.stringify({ email }) });
}

export function verifyResetCode(resetCode: string) {
  return apiRequest<{ status?: string; statusMsg?: string; message?: string }>("/auth/verifyResetCode", { method: "POST", body: JSON.stringify({ resetCode }) });
}

export function resetPassword(email: string, newPassword: string) {
  return apiRequest<AuthResponse>("/auth/resetPassword", { method: "PUT", body: JSON.stringify({ email, newPassword }) });
}

export function changeMyPassword(currentPassword: string, password: string, rePassword: string) {
  return apiRequest<AuthResponse>("/users/changeMyPassword", { method: "PUT", body: JSON.stringify({ currentPassword, password, rePassword }) });
}
