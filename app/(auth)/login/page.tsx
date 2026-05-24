"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LayoutGrid } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    // Fetch role from profiles table
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id);

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      setError(`Error fetching profile: ${profileError.message}`);
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    let profile = null;

    // Check if profile exists
    if (!profiles || profiles.length === 0) {
      // Profile doesn't exist, try to create it with role from user metadata
      const role = data.user.user_metadata?.role || "budget_officer";
      
      const { error: createError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: role,
        });

      if (createError && !createError.message.includes("duplicate")) {
        console.error("Profile creation error:", createError);
        // Don't fail - continue with user metadata role
      }

      profile = { role };
    } else {
      profile = profiles[0];
    }

    if (!profile || !profile.role) {
      setError("Your account does not have a role assigned. Contact your administrator.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // Role-to-dashboard mapping
    const roleDashboardMap: Record<string, string> = {
      admin:            "/budget_officer/dashboard",
      budget_officer:   "/budget_officer/dashboard",
      system_admin:     "/system_admin/dashboard",
      program_owner:    "/program_owner/dashboard",
      pmt_validator:    "/pmt_validator/dashboard",
      pmis_coordinator: "/pmis_coordinator/dashboard",
      hrd_reviewer:     "/hrd_reviewer/dashboard",
      ssme_reviewer:    "/ssme_reviewer/dashboard",
      smme_reviewer:    "/ssme_reviewer/dashboard", // Handle role name variant
      functional_chief: "/functional_chief/dashboard",
      accountant:       "/accountant/dashboard",
      asds:             "/asds/dashboard",
      sds:              "/sds/dashboard",
    };

    const dashboard = roleDashboardMap[profile.role];

    if (!dashboard) {
      setError(`Unknown role: "${profile.role}". Contact your administrator.`);
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // Hard redirect so cookies are fully set before middleware reads them
    window.location.href = dashboard;
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Panel */}
      <div
        className="hidden md:flex flex-col justify-between w-[45%] p-10"
        style={{
          background: "linear-gradient(160deg, #1a3a6b 0%, #2346c1 60%, #1a2a8b 100%)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <LayoutGrid size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">DepEd BMS</p>
            <p className="text-white/60 text-xs">Budget Monitoring System</p>
          </div>
        </div>

        {/* Headline */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-10 h-0.5 bg-white/30 mb-8" />
          <h1 className="text-white font-bold text-4xl leading-tight mb-6">
            Transparent.<br />
            Accountable.<br />
            Efficient.
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            A centralized platform for monitoring allotments, obligations, and
            disbursements across all SDO divisions under DepEd Region II.
          </p>
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs">
          © 2026 Department of Education · SDO Cagayan · Region II
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-[#0d1117] px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8 shadow-xl">

            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-[#1a3a6b] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1a3a6b]" />
                </div>
              </div>
              <div>
                <h2 className="text-gray-900 font-bold text-lg leading-tight">
                  Sign in to your account
                </h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  Enter your DepEd credentials to continue
                </p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </span>
                <p className="text-[11px] text-red-600 leading-snug">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@deped.gov.ph"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] focus:border-transparent placeholder:text-gray-400 disabled:opacity-60 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <button
                    type="button"
                    className="text-xs text-[#2346c1] hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] focus:border-transparent placeholder:text-gray-400 disabled:opacity-60 disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Keep signed in */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="keep-signed-in"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 rounded border-gray-300 accent-[#1a3a6b] cursor-pointer"
                />
                <label htmlFor="keep-signed-in" className="text-sm text-gray-600 cursor-pointer select-none">
                  Keep me signed in
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#2346c1] hover:bg-[#1a3a6b] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google SSO */}
              <button
                type="button"
                disabled={loading}
                className="w-full py-2.5 border border-gray-300 hover:bg-gray-50 disabled:opacity-60 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google (DepEd SSO)
              </button>

            </form>

            <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
              Access is restricted to authorized DepEd personnel only.
              <br />
              Contact your IT administrator for account issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}