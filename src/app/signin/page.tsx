"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Login failed.");
        }
        setSuccess(true);
        localStorage.setItem("yemnest_user", JSON.stringify({ name: data.userName, id: data.userId, email: data.userEmail }));
        window.dispatchEvent(new Event("yemnest_auth_updated"));
        setTimeout(() => {
          router.push("/shop");
        }, 1500);
      })
      .catch((err: any) => {
        setError(err.message || "Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAF9F6] text-zinc-900 font-sans min-h-[75vh]">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <h1 className="text-center text-3xl font-light tracking-tight text-zinc-900">
          Sign In
        </h1>
        <p className="mt-2 text-center text-xs text-zinc-500 uppercase tracking-widest">
          Welcome back
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-[#FEFEFD] py-10 px-6 shadow-sm border border-zinc-200/60 sm:px-12 rounded-none relative overflow-hidden">
          {success ? (
            <div className="py-8 text-center flex flex-col items-center justify-center animate-fade-in">
              <div className="h-12 w-12 rounded-none bg-green-50 flex items-center justify-center border border-green-200 mb-4">
                <svg
                  className="h-6 w-6 text-[#106636]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-normal text-[#106636] mb-1">Logged In Successfully</h3>
              <p className="text-xs text-zinc-500">Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-normal rounded-none">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-xs uppercase tracking-wider font-normal text-zinc-600"
                  >
                    Password
                  </label>
                  <a
                    href="#forgot"
                    className="text-xs text-[#724D26] hover:text-[#5a3b1d] transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-4 pr-12 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    id="toggle-password-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-[#106636] transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#106636] border-zinc-300 rounded-none focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-zinc-500 font-normal">
                  Remember me
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-normal uppercase tracking-wider text-xs transition-colors duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-none shadow-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-200/50 text-center">
            <span className="text-xs text-zinc-500 font-normal">New to Yemnest? </span>
            <button
              onClick={() => router.push("/signup")}
              className="text-xs font-normal text-[#724D26] hover:text-[#5a3b1d] transition-colors border-b border-[#724D26]/40 pb-0.5"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
