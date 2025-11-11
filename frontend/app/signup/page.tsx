"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

type SignupStep = "role-selection" | "form" | "success";

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignupStep>("role-selection");
  const [selectedRole, setSelectedRole] = useState<"admin" | "user" | null>(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null as boolean | null, message: "" });
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd: string) => pwd.length >= 8 && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checkUsername = async (username: string) => {
    if (username.length < 3) { setUsernameStatus({ checking: false, available: false, message: "Min 3 chars" }); return; }
    setUsernameStatus({ checking: true, available: null, message: "" });
    try { 
      const res = await fetch("/api/username/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username }) }); 
      const data = await res.json(); 
      setUsernameStatus({ checking: false, available: data.available, message: data.message }); 
    } catch { 
      setUsernameStatus({ checking: false, available: false, message: "Error" }); 
    }
  };

  const handleFormChange = (e: any) => { 
    const { name, value } = e.target; 
    setForm(p => ({ ...p, [name]: value })); 
    setErrors(p => ({ ...p, [name]: "" })); 
    if (name === "username" && value.length >= 3) setTimeout(() => checkUsername(value), 500); 
  };

  const validateForm = () => { 
    const newErrors: any = {}; 
    if (!form.username || form.username.length < 3) newErrors.username = "Min 3 chars"; 
    if (!form.email || !validateEmail(form.email)) newErrors.email = "Invalid email"; 
    if (!form.password) newErrors.password = "Required"; 
    else if (!validatePassword(form.password)) newErrors.password = "Must have uppercase, lowercase, number, special char, 8+ chars"; 
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "No match"; 
    if (!usernameStatus.available) newErrors.username = usernameStatus.message || "Not available"; 
    setErrors(newErrors); 
    return Object.keys(newErrors).length === 0; 
  };

  const createAccount = async (e: React.FormEvent) => { 
    e.preventDefault();
    if (!validateForm()) return; 
    setLoading(true); 
    try { 
      const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: form.username, email: form.email, password: form.password, role: selectedRole?.toUpperCase() || "USER" }) }); 
      const data = await res.json(); 
      if (res.ok) { 
        setCurrentStep("success"); 
        setTimeout(() => router.push("/signin"), 2000); 
      } else { 
        setErrors(p => ({ ...p, email: data.error })); 
      } 
    } catch { 
      setErrors(p => ({ ...p, email: "Failed to create account" })); 
    } finally { 
      setLoading(false); 
    } 
  };

  return (
    <div className="min-h-screen bg-black flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 relative overflow-hidden">
      <Link href="/" className="fixed top-4 left-4 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>Back to Home</span>
      </Link>

      <div className="w-full max-w-sm sm:max-w-md relative z-10 space-y-6">
        {currentStep === "role-selection" && (
          <>
            <div className="flex flex-col items-center space-y-4 mb-6 sm:mb-8">
              <img src="/Screenshot 2025-09-21 at 12.36.07 PM.svg" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
              <p className="text-white/70 text-lg sm:text-xl text-center">Create Rvidia Account</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => { setSelectedRole("user"); setCurrentStep("form"); }} className="w-full p-4 sm:p-5 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 hover:bg-white/10 text-left rounded-lg transition-all">
                <h3 className="text-white font-semibold mb-1">User Account</h3>
                <p className="text-white/50 text-sm">Access dashboard and manage profile</p>
              </button>
              <button onClick={() => { setSelectedRole("admin"); setCurrentStep("form"); }} className="w-full p-4 sm:p-5 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 hover:bg-white/10 text-left rounded-lg transition-all">
                <h3 className="text-white font-semibold mb-1">Admin Account</h3>
                <p className="text-white/50 text-sm">Full admin access</p>
              </button>
            </div>
            <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-3 text-white/50 font-medium">or</span></div></div>
            <GoogleSignInButton role={selectedRole || "user"} />
            <div className="text-center"><p className="text-white/60 text-sm">Already have an account? <Link href="/signin" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link></p></div>
          </>
        )}

        {currentStep === "form" && (
          <>
            <div className="flex items-center gap-3 mb-6"><button onClick={() => setCurrentStep("role-selection")} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ArrowLeft className="w-4 h-4 text-white/70" /></button><div><h1 className="text-white font-semibold">Sign Up</h1><p className="text-white/50 text-sm">Create your {selectedRole} account</p></div></div>
            <form className="space-y-4 sm:space-y-5" onSubmit={createAccount}>
              <div><input type="text" name="username" value={form.username} onChange={handleFormChange} placeholder="Username" className="w-full h-11 sm:h-12 px-3 py-3 bg-white/5 backdrop-blur-sm text-white border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all text-sm sm:text-base" />{usernameStatus.available === true && <p className="text-green-400 text-xs mt-1">✓ Available</p>}{errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}</div>
              <input type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="Email address" className="w-full h-11 sm:h-12 px-3 py-3 bg-white/5 backdrop-blur-sm text-white border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all text-sm sm:text-base" />{errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              <input type="password" name="password" value={form.password} onChange={handleFormChange} placeholder="Password" className="w-full h-11 sm:h-12 px-3 py-3 bg-white/5 backdrop-blur-sm text-white border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all text-sm sm:text-base" />{errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleFormChange} placeholder="Confirm password" className="w-full h-11 sm:h-12 px-3 py-3 bg-white/5 backdrop-blur-sm text-white border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all text-sm sm:text-base" />{errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              <button type="submit" disabled={loading || !usernameStatus.available} className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-white border-0 rounded-lg shadow-lg text-sm sm:text-base">{loading ? <><Loader2 className="inline mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Account"}</button>
            </form>
            <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-3 text-white/50 font-medium">or</span></div></div>
            <GoogleSignInButton role={selectedRole || "user"} />
            <div className="text-center"><p className="text-white/60 text-sm">Already have an account? <Link href="/signin" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link></p></div>
          </>
        )}

        {currentStep === "success" && (
          <div className="text-center space-y-4 py-8"><div className="text-4xl">✓</div><h1 className="text-white font-semibold text-lg">Account Created!</h1><p className="text-white/60 text-sm">Redirecting to sign in...</p><Loader2 className="w-5 h-5 animate-spin text-blue-400 mx-auto" /></div>
        )}
      </div>
    </div>
  );
}
