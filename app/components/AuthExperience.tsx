"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock3,
  Eye,
  EyeOff,
  Headset,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { signIn, signUp } from "@/lib/auth";
import { notifyCartChanged } from "@/lib/cart";

const styles = {
  main: "auth-main",
  layout: "auth-layout",
  welcome: "auth-welcome",
  intro: "auth-intro",
  heroImage: "auth-heroImage",
  heroStats: "auth-heroStats",
  heroStat: "auth-heroStat",
  formColumn: "auth-formColumn",
  card: "auth-card",
  cardHeader: "auth-cardHeader",
  cardLogo: "auth-cardLogo",
  socialButtons: "auth-socialButtons",
  socialButton: "auth-socialButton",
  googleMark: "auth-googleMark",
  facebookMark: "auth-facebookMark",
  divider: "auth-divider",
  form: "auth-form",
  field: "auth-field",
  labelRow: "auth-labelRow",
  label: "auth-label",
  inputWrap: "auth-inputWrap",
  input: "auth-input",
  inputWithIcon: "auth-inputWithIcon",
  fieldIcon: "auth-fieldIcon",
  forgotLink: "auth-forgotLink",
  passwordToggle: "auth-passwordToggle",
  hint: "auth-hint",
  passwordMeta: "auth-passwordMeta",
  strength: "auth-strength",
  strengthTrack: "auth-strengthTrack",
  strengthFill: "auth-strengthFill",
  strengthWeak: "auth-strengthWeak",
  strengthFair: "auth-strengthFair",
  strengthStrong: "auth-strengthStrong",
  terms: "auth-terms",
  loginOptions: "auth-loginOptions",
  remember: "auth-remember",
  submit: "auth-submit",
  notice: "auth-notice",
  switchPrompt: "auth-switchPrompt",
  trustStats: "auth-trustStats",
  trustStat: "auth-trustStat",
  srOnly: "auth-srOnly",
};

type AuthMode = "signup" | "login";

const benefits = [
  { icon: Truck, title: "Free Delivery" },
  { icon: ShieldCheck, title: "Secure Payment" },
  { icon: Headset, title: "24/7 Support" },
];

function SocialButtons({ onChoose }: { onChoose: (provider: string) => void }) {
  return (
    <div className={styles.socialButtons}>
      <button className={styles.socialButton} type="button" onClick={() => onChoose("Google")}>
        <span className={styles.googleMark} aria-hidden="true">G</span>Continue with Google
      </button>
      <button className={styles.socialButton} type="button" onClick={() => onChoose("Facebook")}>
        <span className={styles.facebookMark} aria-hidden="true">f</span>Continue with Facebook
      </button>
    </div>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
  minLength,
  autoComplete,
  hint,
  children,
  onValueChange,
  labelAfter,
  leading,
  showRequired = true,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  minLength?: number;
  autoComplete?: string;
  hint?: ReactNode;
  children?: ReactNode;
  onValueChange?: (value: string) => void;
  labelAfter?: ReactNode;
  leading?: ReactNode;
  showRequired?: boolean;
}) {
  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={id}>{label}{showRequired && <span aria-hidden="true">*</span>}</label>
        {labelAfter}
      </div>
      <div className={styles.inputWrap}>
        {leading}
        <input className={`${styles.input} ${leading ? styles.inputWithIcon : ""}`} id={id} name={id} type={type} placeholder={placeholder} autoComplete={autoComplete} required minLength={minLength} onChange={onValueChange ? (event) => onValueChange(event.currentTarget.value) : undefined} />
        {children}
      </div>
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
}

export function AuthExperience({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const passwordStrength = password.length === 0
    ? ""
    : password.length < 8
      ? "Weak"
      : /(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)
        ? "Strong"
        : "Fair";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (isSignup && data.get("password") !== data.get("confirmPassword")) {
      setNotice("Your passwords don’t match. Please check them and try again.");
      return;
    }
    const password = String(data.get("password") ?? "");
    const email = String(data.get("email") ?? "");
    setNotice("Connecting securely…");
    try {
      const result = isSignup
        ? await signUp({
            name: String(data.get("name") ?? ""),
            email,
            password,
            rePassword: String(data.get("confirmPassword") ?? ""),
            phone: String(data.get("phone") ?? ""),
          })
        : await signIn({ email, password });
      if (result.token) window.localStorage.setItem("freshcart-token", result.token);
      notifyCartChanged();
      setNotice(isSignup ? "Account created. Welcome to FreshCart!" : "Signed in successfully.");
      router.push("/");
      router.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "We couldn’t connect. Please try again.");
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.layout}>
        <section className={styles.welcome} aria-label="FreshCart grocery delivery">
          <div className={styles.heroImage}>
            <Image
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2e5810ff3e-e750761ebcd4ae5907db.png"
              alt="Fresh vegetables and fruits in a shopping cart"
              fill
              priority
              sizes="(max-width: 800px) 90vw, 46vw"
            />
          </div>
          <h1>FreshCart - Your One-Stop Shop for Fresh Products</h1>
          <p className={styles.intro}>Join thousands of happy customers who trust FreshCart for their daily grocery needs</p>
          <ul className={styles.heroStats}>
            {benefits.map(({ icon: Icon, title }) => (
              <li className={styles.heroStat} key={title}><Icon size={20} fill="currentColor" />{title}</li>
            ))}
          </ul>
        </section>

        <section className={styles.formColumn} aria-labelledby="form-title">
          <div className={styles.card}>
            <div className={styles.cardLogo}><span>Fresh</span>Cart</div>
            <header className={styles.cardHeader}>
              <h2 id="form-title">{isSignup ? "Create Your Account" : "Welcome Back!"}</h2>
              <p>{isSignup ? "Sign up to start your fresh shopping experience" : "Sign in to continue your fresh shopping experience"}</p>
            </header>

            <SocialButtons onChoose={(provider) => setNotice(`${provider} sign-in isn’t connected yet.`)} />
            <div className={styles.divider}><span>OR CONTINUE WITH EMAIL</span></div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {isSignup && <Field id="name" label="Name" placeholder="Your name" autoComplete="name" />}
              <Field id="email" label="Email Address" placeholder="Enter your email" type="email" autoComplete="email" showRequired={isSignup} leading={<Mail className={styles.fieldIcon} size={19} />} />

              <Field
                id="password"
                label="Password"
                placeholder={isSignup ? "Create a strong password" : "Enter your password"}
                type={passwordVisible ? "text" : "password"}
                minLength={isSignup ? 8 : undefined}
                autoComplete={isSignup ? "new-password" : "current-password"}
                showRequired={isSignup}
                leading={<LockKeyhole className={styles.fieldIcon} size={18} />}
                labelAfter={!isSignup && <a className={styles.forgotLink} href="/forgot-password">Forgot Password?</a>}
                hint={isSignup ? <>
                  <span className={styles.passwordMeta}>Must be at least 8 characters with numbers and symbols</span>
                  {password.length > 0 && <span className={styles.strength}><span className={styles.strengthTrack}><span className={`${styles.strengthFill} ${styles[`strength${passwordStrength}` as keyof typeof styles]}`} /></span><span>{passwordStrength}</span></span>}
                </> : undefined}
                onValueChange={setPassword}
              >
                <button type="button" className={styles.passwordToggle} aria-label={passwordVisible ? "Hide password" : "Show password"} onClick={() => setPasswordVisible((visible) => !visible)}><span className={styles.srOnly}>{passwordVisible ? "Hide password" : "Show password"}</span>{passwordVisible ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </Field>

              {isSignup ? (
                <>
                  <Field id="confirmPassword" label="Confirm Password" placeholder="Confirm your password" type={passwordVisible ? "text" : "password"} minLength={8} autoComplete="new-password" />
                  <Field id="phone" label="Phone Number" placeholder="+1 234 567 8900" type="tel" autoComplete="tel" />
                  <label className={styles.terms}>
                    <input type="checkbox" name="terms" required />
                    <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a><sup>*</sup></span>
                  </label>
                </>
              ) : (
                <div className={styles.loginOptions}>
                  <label className={styles.remember}><input type="checkbox" name="remember" />Keep me signed in</label>
                </div>
              )}

              <button className={styles.submit} type="submit">
                {isSignup ? <><UserRound size={18} />Create My Account</> : "Sign In"}
              </button>
              <p className={styles.notice} aria-live="polite">{notice}</p>
            </form>

            <p className={styles.switchPrompt}>
              {isSignup ? "Already have an account? " : "New to FreshCart? "}
              <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign In" : "Create an account"}</Link>
            </p>
            <div className={styles.trustStats}>
              <span className={styles.trustStat}><Check size={16} />SSL Secured</span>
              <span className={styles.trustStat}><UserRound size={16} />50K+ Users</span>
              <span className={styles.trustStat}><Clock3 size={16} />4.9 Rating</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
