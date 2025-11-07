"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

type ForgotStep = "email" | "reset" | "success";

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState<ForgotStep>("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pwd: string) => pwd.length >= 8 && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

  const requestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!email || !validateEmail(email)) { setErrors({ email: "Invalid email" }); return; }
    
    setLoading(true);
    try {
      const res = await fetch("/api/users/check-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok) { setCurrentStep("reset"); } else setErrors({ email: data.error || "Email not found" });
    } catch { setErrors({ email: "Failed to verify email" }); } 
    finally { setLoading(false); }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!newPassword || !validatePassword(newPassword)) { setErrors({ newPassword: "Must have uppercase, lowercase, number, special char, 8+ chars" }); return; }
    if (newPassword !== confirmPassword) { setErrors({ confirmPassword: "No match" }); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, newPassword }) });
      const data = await res.json();
      if (res.ok) { setCurrentStep("success"); setTimeout(() => window.location.href = "/signin", 2000); } else setErrors({ form: data.error || "Failed" });
    } catch { setErrors({ form: "Failed to reset password" }); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 relative overflow-hidden">
      <Link href="/signin" className="fixed top-4 left-4 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>Back to Sign In</span>
      </Link>

      <div className="w-full max-w-sm sm:max-w-md relative z-10 space-y-6">
        {currentStep === "email" && (
          <>
            <div className="flex flex-col items-center space-y-4 mb-6 sm:mb-8">
              <img src="/Screenshot 2025-09-21 at 12.36.07 PM.svg" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
              <div className="text-center"><h1 className="text-white font-semibold text-lg sm:text-xl">Reset Password</h1><p className="text-white/50 text-sm mt-1">Enter your email address</p></div>
            </div>
            <form className="space-y-4 sm:space-y-5" onSubmit={requestPasswordReset}>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({}); }} placeholder="Email address" className="w-full h-11 sm:h-12 px-3 py-3 bg-white/5 backdrop-blur-sm text-white border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all text-sm sm:text-base" />{errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              <button type="submit" disabled={loading} className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-white border-0 rounded-lg shadow-lg text-sm sm:text-base">{loading ? <><Loader2 className="inline mr-2 h-4 w-4 animate-spin" />Verifying...</> : "Continue"}</button>
            </form>
            <div className="text-center"><p className="text-white/60 text-sm">Remember your password? <Link href="/signin" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link></p></div>
          </>
        )}

        {currentStep === "reset" && (
          <>
            <div className="flex items-center gap-3 mb-6"><button onClick={() => { setCurrentStep("email"); setNewPassword(""); setConfirmPassword(""); setErrors({}); }} disabled={loading} className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"><ArrowLeft className="w-4 h-4 text-white/70" /></button><div><h1 className="text-white font-semibold">New Password</h1><p className="text-white/50 text-sm">Create a new password</p></div></div>
            <form className="space-y-4 sm:space-y-5" onSubmit={resetPassword}>
              <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setErrors({}); }} placeholder="New password" className="w-full h-11 sm:h-12 px-3 py-3 bg-white/5 backdrop-blur-sm text-white border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all text-sm sm:text-base" />{errors.newPassword && <p className="text-red-400 text-xs">{errors.newPassword}</p>}
              <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }} placeholder="Confirm password" className="w-full h-11 sm:h-12 px-3 py-3 bg-white/5 backdrop-blur-sm text-white border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all text-sm sm:text-base" />{errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword}</p>}
              {errors.form && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded px-3 py-2">{errors.form}</p>}
              <button type="submit" disabled={loading} className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-white border-0 rounded-lg shadow-lg text-sm sm:text-base">{loading ? <><Loader2 className="inline mr-2 h-4 w-4 animate-spin" />Resetting...</> : "Reset Password"}</button>
            </form>
          </>
        )}

        {currentStep === "success" && (
          <div className="text-center space-y-4 py-8"><div className="text-4xl">✓</div><h1 className="text-white font-semibold text-lg">Password Reset!</h1><p className="text-white/60 text-sm">Redirecting to sign in...</p><Loader2 className="w-5 h-5 animate-spin text-blue-400 mx-auto" /></div>
        )}
      </div>
    </div>
  );
}
