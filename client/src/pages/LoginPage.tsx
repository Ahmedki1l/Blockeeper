/**
 * BLOCKEEPER LOGIN PAGE
 * Design: Dark Navy + Neon Cyan - Auth Screen
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663089570646/RFGDf2S7CSskxcLJx8eG2q/blockeeper_1white_14a1b3c8.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const { t, isRTL } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError(t("login.fillFields")); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setLocation("/"); }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bk-grid-bg" style={{ background: "#0A0F1E" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* Glow orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />

      <div className="w-full max-w-md px-4 animate-bk-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={LOGO} alt="BlocKeeper" className="h-10 mx-auto mb-4" style={{ objectFit: "contain" }} />
          <p style={{ color: "#94A3B8", fontSize: "0.875rem" }}>{t("login.tagline")}</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "#0D1526", border: "1px solid rgba(0,212,255,0.15)", boxShadow: "0 0 40px rgba(0,212,255,0.05)" }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}>
              <Shield size={20} style={{ color: "#00D4FF" }} />
            </div>
            <div>
              <h2 className="font-bold" style={{ color: "#F1F5F9", fontSize: "1.1rem" }}>{t("login.welcome")}</h2>
              <p style={{ color: "#94A3B8", fontSize: "0.75rem" }}>{t("login.signIn")}</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={14} style={{ color: "#EF4444" }} />
              <span style={{ color: "#EF4444", fontSize: "0.8rem" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1.5" style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 500 }}>{t("login.email")}</label>
              <div className="relative">
                <Mail size={15} className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2`} style={{ color: "#94A3B8" }} />
                <input
                  type="email"
                  className="bk-input"
                  style={{ paddingLeft: isRTL ? "1rem" : "2.25rem", paddingRight: isRTL ? "2.25rem" : "1rem" }}
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 500 }}>{t("login.password")}</label>
                <Link href="/forgot-password" style={{ color: "#00D4FF", fontSize: "0.75rem", textDecoration: "none" }}>{t("login.forgotPassword")}</Link>
              </div>
              <div className="relative">
                <Lock size={15} className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2`} style={{ color: "#94A3B8" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="bk-input"
                  style={{ paddingLeft: isRTL ? "2.5rem" : "2.25rem", paddingRight: isRTL ? "2.25rem" : "2.5rem" }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`} style={{ color: "#94A3B8" }} onClick={() => setShowPassword(s => !s)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="bk-btn-primary w-full flex items-center justify-center gap-2 mt-2" style={{ padding: "0.75rem" }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-bk-spin" />
                  {t("login.signingIn")}
                </>
              ) : (
                <>
                  <Shield size={16} />
                  {t("login.signInBtn")}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(0,212,255,0.1)" }} />
            <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>{t("login.or")}</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,212,255,0.1)" }} />
          </div>

          <p className="text-center" style={{ color: "#94A3B8", fontSize: "0.8rem" }}>
            {t("login.noAccount")}{" "}
            <Link href="/register" style={{ color: "#00D4FF", fontWeight: 500, textDecoration: "none" }}>{t("login.createAccount")}</Link>
          </p>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Lock size={12} style={{ color: "#94A3B8" }} />
          <span style={{ color: "#94A3B8", fontSize: "0.7rem" }}>{t("login.securityNote")}</span>
        </div>
      </div>
    </div>
  );
}
