"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Landmark,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  IdCard,
} from "lucide-react";

interface AuthFormProps {
  initialMode?: "login" | "signup";
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupFullName, setSignupFullName] = useState("");
  const [signupNationalId, setSignupNationalId] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني أو رقم الهاتف.");
      return;
    }
    if (!loginPassword) {
      setErrorMessage("يرجى إدخال كلمة المرور.");
      return;
    }

    setIsLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("تم تسجيل الدخول بنجاح! جاري تحويلك...");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }, 1000);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signupFullName.trim()) {
      setErrorMessage("يرجى إدخال الاسم الكامل.");
      return;
    }
    if (!signupNationalId.trim() || signupNationalId.trim().length < 8) {
      setErrorMessage("يرجى إدخال الرقم المدني / الهوية الوطنية بشكل صحيح.");
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }
    if (!signupPhone.trim() || signupPhone.length < 8) {
      setErrorMessage("يرجى إدخال رقم هاتف صحيح.");
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage("كلمة المرور يجب أن لا تقل عن 6 أحرف.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("يجب الموافقة على الشروط والأحكام للاستمرار.");
      return;
    }

    setIsLoading(true);
    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("تم إنشاء حسابك بنجاح! جاري تحويلك...");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050A14] text-[#FAF7F0] flex flex-col justify-center items-center py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient lighting effects matching the website palette */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF85]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#1E447B]/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8EA3BF] hover:text-[#D4AF85] transition-colors py-1.5 px-3.5 rounded-full bg-[#0A1628]/80 border border-[#1E3A63]/80 backdrop-blur-md"
        >
          <ArrowRight className="w-4 h-4 text-[#D4AF85]" />
          <span>العودة للرئيسية</span>
        </Link>

        <span className="text-xs text-[#8EA3BF] flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF85]" />
          <span>بوابة آمنة ومحمية</span>
        </span>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] backdrop-blur-xl border border-[#1E3A63]/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative z-10 transition-all duration-300">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link href="/" className="group mb-3 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#050C18] border border-[#1E3A63] flex items-center justify-center text-[#D4AF85] shadow-inner group-hover:border-[#D4AF85] group-hover:scale-105 transition-all">
              <Landmark className="w-7 h-7 text-[#D4AF85]" />
            </div>
            <h1 className="font-aref text-3xl font-bold bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent mt-3 transition-colors">
              جامع الحق
            </h1>
          </Link>
          <p className="text-xs sm:text-sm text-[#8EA3BF] max-w-xs leading-relaxed">
            المجلس العام — صرح الإيمان والسكينة
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#050C18] rounded-2xl border border-[#1E3A63] mb-6">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 ${
              mode === "login"
                ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] text-[#FFF2D2] border border-[#D4AF85]/80 shadow-[0_4px_15px_rgba(0,0,0,0.5),0_0_12px_rgba(212,175,133,0.3)]"
                : "text-[#8EA3BF] hover:text-[#FAF7F0]"
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 ${
              mode === "signup"
                ? "bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] text-[#FFF2D2] border border-[#D4AF85]/80 shadow-[0_4px_15px_rgba(0,0,0,0.5),0_0_12px_rgba(212,175,133,0.3)]"
                : "text-[#8EA3BF] hover:text-[#FAF7F0]"
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* Feedback Alert Messages */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 text-right">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2 text-right">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* =========================================================================
            LOGIN FORM
            ========================================================================= */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Identifier Input (Email / Phone) */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5 text-right">
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="name@example.com أو 05xxxxxxxx"
                  dir="ltr"
                  className="w-full bg-[#050C18] border border-[#1E3A63] focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] rounded-xl px-4 py-3 pl-10 text-sm text-[#FAF7F0] placeholder:text-[#8EA3BF]/40 outline-none transition text-right"
                />
                <User className="w-4 h-4 text-[#8EA3BF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#8EA3BF]">
                  كلمة المرور
                </label>
                <a
                  href="#forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("سيتم إرسال رابط استعادة كلمة المرور إلى بريدك أو هاتفك المسجل.");
                  }}
                  className="text-[11px] text-[#D4AF85] hover:text-[#FFE8B8] font-semibold transition"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-[#050C18] border border-[#1E3A63] focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] rounded-xl px-4 py-3 pl-10 text-sm text-[#FAF7F0] placeholder:text-[#8EA3BF]/40 outline-none transition text-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8EA3BF] hover:text-[#FAF7F0] transition"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1 text-right">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#050C18] border-[#1E3A63] text-[#D4AF85] focus:ring-[#D4AF85] accent-[#D4AF85] cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-[#8EA3BF] cursor-pointer select-none">
                تذكر بيانات الدخول على هذا الجهاز
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 rounded-xl bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] text-[#FFF2D2] border border-[#D4AF85]/80 hover:border-[#FFF0C8] font-bold text-sm transition shadow-[0_10px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,133,0.35)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#D4AF85] border-t-transparent rounded-full animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* =========================================================================
            SIGNUP FORM
            ========================================================================= */}
        {mode === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5 text-right">
                الاسم الكامل *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  placeholder="مثال: محمد بن فهد"
                  className="w-full bg-[#050C18] border border-[#1E3A63] focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#FAF7F0] placeholder:text-[#8EA3BF]/40 outline-none transition text-right"
                />
                <User className="w-4 h-4 text-[#8EA3BF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* National ID / Civil ID */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5 text-right">
                الرقم المدني / الهوية الوطنية *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={signupNationalId}
                  onChange={(e) => setSignupNationalId(e.target.value)}
                  placeholder="أدخل الرقم المدني أو رقم الهوية"
                  dir="ltr"
                  className="w-full bg-[#050C18] border border-[#1E3A63] focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#FAF7F0] placeholder:text-[#8EA3BF]/40 outline-none transition text-right"
                />
                <IdCard className="w-4 h-4 text-[#8EA3BF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5 text-right">
                البريد الإلكتروني *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full bg-[#050C18] border border-[#1E3A63] focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#FAF7F0] placeholder:text-[#8EA3BF]/40 outline-none transition text-right"
                />
                <Mail className="w-4 h-4 text-[#8EA3BF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5 text-right">
                رقم الهاتف الجوال *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className="w-full bg-[#050C18] border border-[#1E3A63] focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#FAF7F0] placeholder:text-[#8EA3BF]/40 outline-none transition text-right"
                />
                <Phone className="w-4 h-4 text-[#8EA3BF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5 text-right">
                كلمة المرور *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="6 أحرف على الأقل"
                  dir="ltr"
                  className="w-full bg-[#050C18] border border-[#1E3A63] focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#FAF7F0] placeholder:text-[#8EA3BF]/40 outline-none transition text-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8EA3BF] hover:text-[#FAF7F0] transition"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3BF] mb-1.5 text-right">
                تأكيد كلمة المرور *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="أعد كتابة كلمة المرور"
                  dir="ltr"
                  className="w-full bg-[#050C18] border border-[#1E3A63] focus:border-[#D4AF85] focus:ring-1 focus:ring-[#D4AF85] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#FAF7F0] placeholder:text-[#8EA3BF]/40 outline-none transition text-right"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8EA3BF] hover:text-[#FAF7F0] transition"
                  aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-2 pt-1 text-right">
              <input
                id="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded bg-[#050C18] border-[#1E3A63] text-[#D4AF85] focus:ring-[#D4AF85] accent-[#D4AF85] cursor-pointer shrink-0"
              />
              <label htmlFor="agreeTerms" className="text-[11px] text-[#8EA3BF] cursor-pointer select-none leading-relaxed">
                أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بمجلس جامع الحق.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 rounded-xl bg-[linear-gradient(to_left,#050B14_0%,#0A1628_30%,#122849_65%,#1E447B_100%)] hover:bg-[linear-gradient(to_left,#081120_0%,#0E203A_30%,#183561_65%,#265394_100%)] text-[#FFF2D2] border border-[#D4AF85]/80 hover:border-[#FFF0C8] font-bold text-sm transition shadow-[0_10px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,133,0.35)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#D4AF85] border-t-transparent rounded-full animate-spin" />
                  <span>جاري إنشاء الحساب...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D4AF85]" />
                  <span>إنشاء الحساب الآن</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-5 border-t border-[#1E3A63]/80 text-center">
          <p className="text-xs text-[#8EA3BF]">
            {mode === "login" ? (
              <>
                ليس لديك حساب بعد؟{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-bold text-[#D4AF85] hover:text-[#FFE8B8] transition underline-offset-4 hover:underline"
                >
                  إنشاء حساب جديد
                </button>
              </>
            ) : (
              <>
                لديك حساب بالفعل؟{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-bold text-[#D4AF85] hover:text-[#FFE8B8] transition underline-offset-4 hover:underline"
                >
                  تسجيل الدخول
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Security and Trust Footer */}
      <footer className="mt-6 text-center text-xs text-[#8EA3BF]/70 flex items-center gap-4">
        <span>© جامع الحق — جميع الحقوق محفوظة</span>
        <span>•</span>
        <span>الخصوصية والأمان</span>
      </footer>
    </div>
  );
}

