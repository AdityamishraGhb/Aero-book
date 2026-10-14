"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await signIn("credentials", {
        email,
        password: password || "password123",
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMsg("Authentication failed. Please verify your email.");
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setErrorMsg("Unexpected authentication error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await signIn("credentials", {
        email: "aditya@aerobook.in",
        password: "demo",
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
    <div className="flex-1 w-full flex items-center justify-center min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Sign in to AeroBook
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Access your saved searches, booking references, and flight alerts.
          </p>
        </div>

        <Card className="border-border shadow-soft-md bg-card">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-xs">
              Sign in with your preferred method below
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
                {errorMsg}
              </div>
            )}

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full h-11 font-semibold text-xs gap-3"
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

            <div className="relative my-4 flex items-center justify-center">
              <span className="w-full border-t border-border/80" />
              <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider relative">
                or email
              </span>
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="aditya@aerobook.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs"
                    required
                  />
                  <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Password</label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 text-xs"
                  />
                  <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                disabled={isLoading}
                className="w-full h-11 text-xs font-bold gap-2 mt-2 shadow-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in with Email</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>

            {/* One-Click Demo Mode button */}
            <div className="pt-2 border-t border-border/80">
              <Button
                type="button"
                variant="secondary"
                disabled={isLoading}
                onClick={handleDemoLogin}
                className="w-full h-10 text-xs font-bold gap-2 border border-border"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Instant Demo Login (Aditya Mishra)</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to AeroBook&apos;s{" "}
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
