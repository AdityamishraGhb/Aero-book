"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "register"; // Registration FIRST by default

  const [mode, setMode] = React.useState<"register" | "signin">(initialMode);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  // Registration Form State
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState(""); // Surname
  const [phoneCountryCode, setPhoneCountryCode] = React.useState("+91");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [registerEmail, setRegisterEmail] = React.useState("");
  const [registerPassword, setRegisterPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Sign In Form State
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!firstName.trim()) {
      setErrorMsg("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setErrorMsg("Please enter your surname (last name).");
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }
    if (!registerEmail.trim() || !registerEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (registerPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (registerPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);

    try {
      const fullPhone = `${phoneCountryCode} ${phoneNumber.trim()}`;
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      // 1. Call registration API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: fullPhone,
          email: registerEmail.trim(),
          password: registerPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      // Store in localStorage for immediate profile hydration
      const userProfile = {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: fullPhone,
        email: registerEmail.trim(),
      };
      try {
        localStorage.setItem("aerobook_registered_user", JSON.stringify(userProfile));
      } catch {}

      setSuccessMsg("Account created successfully! Logging you in...");

      // 2. Automatically sign in with credentials
      const signInRes = await signIn("credentials", {
        email: registerEmail.trim(),
        password: registerPassword,
        redirect: false,
        callbackUrl,
      });

      if (signInRes?.error) {
        // Fallback: reload or redirect to callback
        router.push(callbackUrl);
      } else {
        router.push(callbackUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  // Handle Email & Password Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await signIn("credentials", {
        email: loginEmail.trim(),
        password: loginPassword || "password123",
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMsg("Authentication failed. Please verify your email and password.");
        setIsLoading(false);
      } else {
        // Sync local profile if exists or set basic profile
        try {
          const existing = localStorage.getItem("aerobook_registered_user");
          if (!existing) {
            localStorage.setItem(
              "aerobook_registered_user",
              JSON.stringify({
                email: loginEmail.trim(),
                name: loginEmail.split("@")[0].replace(/[._]/g, " "),
              })
            );
          }
        } catch {}

        router.push(callbackUrl);
      }
    } catch {
      setErrorMsg("Unexpected authentication error. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle Instant Demo Login
  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      localStorage.setItem(
        "aerobook_registered_user",
        JSON.stringify({
          firstName: "Aditya",
          lastName: "Mishra",
          name: "Aditya Mishra",
          email: "aditya@aerobook.in",
          phone: "+91 9876543210",
        })
      );

      await signIn("credentials", {
        email: "aditya@aerobook.in",
        password: "password123",
        redirect: false,
        callbackUrl,
      });
      router.push(callbackUrl);
    } catch {
      setErrorMsg("Demo login failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center min-h-[calc(100vh-140px)] py-10 px-4 sm:px-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Header with Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            {mode === "register" ? "Create your AeroBook Account" : "Sign in to AeroBook"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            {mode === "register"
              ? "Join AeroBook to save flight alerts, manage passenger details, and track live bookings."
              : "Welcome back! Enter your details to access your bookings and travel preferences."}
          </p>
        </div>

        <Card className="border-border shadow-soft-md bg-card overflow-hidden">
          {/* Dual Toggle Tabs: Register (First) & Sign In */}
          <div className="grid grid-cols-2 border-b border-border/80 bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={cn(
                "py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                mode === "register"
                  ? "bg-card text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <UserIcon className="h-3.5 w-3.5 text-primary" />
              <span>1. Register (New User)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={cn(
                "py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                mode === "signin"
                  ? "bg-card text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Lock className="h-3.5 w-3.5 text-accent" />
              <span>2. Sign In (Existing)</span>
            </button>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-5">
            {/* Notifications */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium flex items-start gap-2">
                <span className="text-sm font-bold">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* MODE 1: REGISTRATION PAGE FIRST */}
            {mode === "register" ? (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name Fields: First Name & Surname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      First Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="e.g. Aditya"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-9 text-xs"
                        required
                      />
                      <UserIcon className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Surname / Last Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="e.g. Mishra"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-9 text-xs"
                        required
                      />
                      <UserIcon className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Mobile Phone Number <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className="h-9 rounded-md border border-input bg-card px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="+91">🇮🇳 +91 (IN)</option>
                      <option value="+1">🇺🇸 +1 (US)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+971">🇦🇪 +971 (UAE)</option>
                      <option value="+65">🇸🇬 +65 (SG)</option>
                      <option value="+61">🇦🇺 +61 (AU)</option>
                    </select>
                    <div className="relative flex-1">
                      <Input
                        type="tel"
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-9 text-xs"
                        required
                      />
                      <Phone className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Used for instant flight delay alerts and gate changes via SMS/WhatsApp.
                  </p>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="traveller@aerobook.in"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-9 text-xs"
                      required
                    />
                    <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Create Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 chars"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-9 pr-9 text-xs"
                        required
                      />
                      <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Confirm Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-9 text-xs"
                        required
                      />
                      <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Submit Register CTA */}
                <Button
                  type="submit"
                  variant="accent"
                  disabled={isLoading}
                  className="w-full h-11 text-xs font-bold gap-2 mt-2 shadow-xs cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-1">
                  <p className="text-xs text-muted-foreground">
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="font-bold text-primary hover:underline cursor-pointer"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* MODE 2: SIGN IN */
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Email Address</label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="aditya@aerobook.in"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-9 text-xs"
                      required
                    />
                    <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-foreground">Password</label>
                    <span className="text-[11px] text-primary cursor-pointer hover:underline">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-9 pr-9 text-xs"
                    />
                    <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  disabled={isLoading}
                  className="w-full h-11 text-xs font-bold gap-2 mt-2 shadow-xs cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In with Email</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-1">
                  <p className="text-xs text-muted-foreground">
                    New to AeroBook?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="font-bold text-primary hover:underline cursor-pointer"
                    >
                      Register your account
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Separator */}
            <div className="relative my-4 flex items-center justify-center">
              <span className="w-full border-t border-border/80" />
              <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider relative">
                or continue with
              </span>
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full h-11 font-semibold text-xs gap-3 border-border hover:bg-muted/50 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            {/* Instant Demo Login Button */}
            <div className="pt-2 border-t border-border/80">
              <Button
                type="button"
                variant="secondary"
                disabled={isLoading}
                onClick={handleDemoLogin}
                className="w-full h-10 text-xs font-bold gap-2 border border-border cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Instant Reviewer Login (Aditya Mishra)</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Legal notice */}
        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to AeroBook&apos;s{" "}
          <Link href="#" className="underline text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 w-full flex items-center justify-center min-h-[calc(100vh-140px)]">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading AeroBook Auth...</span>
          </div>
        </div>
      }
    >
      <AuthPageContent />
    </React.Suspense>
  );
}
