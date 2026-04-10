"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/lib/hooks";
import { Button, Spinner } from "@/components/ui";

const schema = yup.object({
  email: yup.string().required("Email/User ID is required"),
  password: yup
    .string()
    .min(4, "Min 4 characters")
    .required("Password is required"),
});

// Demo credentials for both roles
const DEMO_CREDENTIALS = {
  employer: { email: "admin@techcorp.com", password: "admin123" },
  candidate: { email: "john@example.com", password: "pass123" },
};

export default function LoginPage() {
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data) {
    setLoading(true);
    setServerError("");

    // Auto-detect role based on email
    let role = "candidate"; // default role

    if (
      data.email.includes("admin") ||
      data.email.includes("employer") ||
      data.email.includes("techcorp")
    ) {
      role = "employer";
    } else if (
      data.email.includes("john") ||
      data.email.includes("candidate") ||
      data.email.includes("example")
    ) {
      role = "candidate";
    }

    const result = await signIn(data.email, data.password, role);
    if (!result.success) {
      setServerError(result.error || "Invalid credentials. Please try again.");
      setLoading(false);
    }
  }

  // Helper to fill demo credentials
  const fillDemoCredentials = (type) => {
    setValue("email", DEMO_CREDENTIALS[type].email);
    setValue("password", DEMO_CREDENTIALS[type].password);
    setServerError("");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      {/* --- NAVBAR --- */}
      <nav className="w-full bg-white px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="text-[#3F4195] font-bold text-xl flex items-center gap-1">
            AKIJ{" "}
            <span className="font-light text-sm border-l border-gray-400 pl-1 uppercase tracking-tighter">
              Resource
            </span>
          </div>
        </div>
        <h2 className="text-[#374151] text-xl font-semibold">Akij Resource</h2>
        <div className="w-[120px]"></div>
      </nav>

      {/* --- MAIN CONTENT (LOGIN FORM) --- */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-[#374151] text-2xl font-bold mb-6">Sign In</h1>

        <div className="bg-white p-10 rounded-[20px] shadow-sm border border-gray-100 w-full max-w-[480px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email/User ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Email/User ID
              </label>
              <input
                {...register("email")}
                type="text"
                placeholder="Enter your email/User ID"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#6336FF] outline-none transition-all placeholder:text-gray-400 text-gray-950"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#374151]">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#6336FF] outline-none transition-all placeholder:text-gray-400 text-gray-950"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forget Password */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-[#374151] font-medium hover:text-[#6336FF] transition-colors"
              >
                Forget Password?
              </a>
            </div>

            {serverError && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                {serverError}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6336FF] hover:bg-[#5229e6] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner className="mx-auto h-5 w-5" /> : "Sign In"}
            </button>
          </form>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0A0B1A] text-white px-10 py-6 flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Powered by</span>
          <div className="font-bold text-lg flex items-center">
            AKIJ{" "}
            <span className="font-light text-xs border-l border-gray-600 ml-1 pl-1 uppercase">
              Resource
            </span>
          </div>
        </div>

        <div className="flex gap-8 items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Helpline</span>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>+88 011020202505</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>✉️</span>
            <span>support@akij.work</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
