"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { forgotPasswords, resetPassword, verifyResetCode } from "@/lib/auth";

type Step = 1 | 2 | 3;
export function ForgotPasswordFlow() {
 const [step,setStep]=useState<Step>(1); const [email,setEmail]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [done,setDone]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(""); const data=new FormData(event.currentTarget); try {
  if(step===1){ const value=String(data.get("email")??"").trim(); await forgotPasswords(value); setEmail(value); setStep(2); }
  else if(step===2){ await verifyResetCode(String(data.get("resetCode")??"").trim()); setStep(3); }
  else { const result=await resetPassword(email,String(data.get("newPassword")??"")); window.localStorage.setItem("freshcart-token",result.token); setDone(true); }
 } catch(cause){setError(cause instanceof Error?cause.message:"Could not continue password recovery.");} finally{setBusy(false);} }
 return <main className="grid min-h-[65vh] place-items-center bg-slate-50 px-4 py-10"><section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h1 className="text-2xl font-bold">Reset your password</h1><p className="mt-2 text-sm text-slate-500">Step {step} of 3</p>{done?<div className="mt-6"><p className="text-emerald-700">Your password has been updated.</p><Link href="/login" className="mt-4 inline-block text-emerald-700">Continue to sign in</Link></div>:<form onSubmit={(event)=>void submit(event)} className="mt-6 space-y-4">{step===1&&<label className="block text-sm">Email<input name="email" type="email" required autoComplete="email" className="mt-1 block h-11 w-full rounded-md border border-slate-300 px-3"/></label>}{step===2&&<label className="block text-sm">Reset code<input name="resetCode" required inputMode="numeric" className="mt-1 block h-11 w-full rounded-md border border-slate-300 px-3"/></label>}{step===3&&<label className="block text-sm">New password<input name="newPassword" type="password" required minLength={6} autoComplete="new-password" className="mt-1 block h-11 w-full rounded-md border border-slate-300 px-3"/></label>}{error&&<p className="text-sm text-rose-600" role="alert">{error}</p>}<button disabled={busy} className="h-11 w-full rounded-md bg-emerald-600 font-semibold text-white disabled:opacity-60">{busy?"Please wait…":step===1?"Send reset code":step===2?"Verify code":"Update password"}</button></form>}</section></main>;
}
