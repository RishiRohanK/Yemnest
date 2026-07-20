"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternativeMobileNumber, setAlternativeMobileNumber] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "None",
    color: "bg-zinc-200",
    textClass: "text-zinc-400",
  });

  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "None", color: "bg-zinc-200", textClass: "text-zinc-400" });
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "Weak";
    let color = "bg-red-400";
    let textClass = "text-red-500";

    if (score >= 4) {
      label = "Strong";
      color = "bg-[#106636]";
      textClass = "text-[#106636]";
    } else if (score >= 2) {
      label = "Medium";
      color = "bg-amber-400";
      textClass = "text-amber-500";
    }

    setPasswordStrength({ score, label, color, textClass });
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !name ||
      !email ||
      !password ||
      !houseNo ||
      !addressLine1 ||
      !pincode ||
      !phoneNumber ||
      !alternativeMobileNumber
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms and Privacy Policy.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        houseNo,
        addressLine1,
        pincode,
        phoneNumber,
        alternativeMobileNumber,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Registration failed.");
        }
        setSuccess(true);
        setTimeout(() => {
          router.push("/signin");
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
          Create Account
        </h1>
        <p className="mt-2 text-center text-xs text-zinc-500 uppercase tracking-widest">
          Sign up below
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
              <h3 className="text-lg font-normal text-[#106636] mb-1">Registered Successfully</h3>
              <p className="text-xs text-zinc-500">Redirecting to sign in page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-normal rounded-none">
                  {error}
                </div>
              )}

              {/* Two Column Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Full Name */}
                <div className="col-span-1">
                  <label
                    htmlFor="name"
                    className="block text-[10px] uppercase tracking-wider font-normal text-zinc-500 mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-xs font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                    placeholder="Enter name"
                  />
                </div>

                {/* Email Address */}
                <div className="col-span-1">
                  <label
                    htmlFor="email"
                    className="block text-[10px] uppercase tracking-wider font-normal text-zinc-500 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-xs font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                    placeholder="name@example.com"
                  />
                </div>

                {/* Password */}
                <div className="col-span-1">
                  <label
                    htmlFor="new-password"
                    className="block text-[10px] uppercase tracking-wider font-normal text-zinc-500 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      name="new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-3.5 pr-10 py-2.5 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-xs font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      id="toggle-password-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-[#106636] transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                {/* Primary Phone */}
                <div className="col-span-1">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-[10px] uppercase tracking-wider font-normal text-zinc-500 mb-1.5"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-xs font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                    placeholder="Primary phone number"
                  />
                </div>

                {/* Password Strength Widget */}
                {password && (
                  <div className="col-span-1 md:col-span-2 bg-[#FAF9F6]/50 p-3.5 border border-zinc-200/40 rounded-none">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                        Password Strength
                      </span>
                      <span className={`text-[9px] font-medium uppercase tracking-wider ${passwordStrength.textClass}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-zinc-200/50 rounded-none overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Divider Address Header */}
                <div className="col-span-1 md:col-span-2 border-t border-zinc-200/60 pt-4 mt-2">
                  <h3 className="text-xs uppercase tracking-widest text-[#724D26] font-normal mb-1">
                    Address
                  </h3>
                  <p className="text-[10px] text-zinc-400">Fill in your delivery address</p>
                </div>

                {/* House No */}
                <div className="col-span-1">
                  <label
                    htmlFor="houseNo"
                    className="block text-[10px] uppercase tracking-wider font-normal text-zinc-500 mb-1.5"
                  >
                    House No
                  </label>
                  <input
                    id="houseNo"
                    name="houseNo"
                    type="text"
                    required
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-xs font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                    placeholder="House / Apt / Suite number"
                  />
                </div>

                {/* Alternative Mobile */}
                <div className="col-span-1">
                  <label
                    htmlFor="alternativeMobileNumber"
                    className="block text-[10px] uppercase tracking-wider font-normal text-zinc-500 mb-1.5"
                  >
                    Alternative Mobile Number
                  </label>
                  <input
                    id="alternativeMobileNumber"
                    name="alternativeMobileNumber"
                    type="tel"
                    required
                    value={alternativeMobileNumber}
                    onChange={(e) => setAlternativeMobileNumber(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-xs font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                    placeholder="Alternative phone number"
                  />
                </div>

                {/* Address Line 1 */}
                <div className="col-span-1">
                  <label
                    htmlFor="addressLine1"
                    className="block text-[10px] uppercase tracking-wider font-normal text-zinc-500 mb-1.5"
                  >
                    Address Line 1
                  </label>
                  <input
                    id="addressLine1"
                    name="addressLine1"
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-xs font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                    placeholder="Street name, locality"
                  />
                </div>

                {/* Pin Code */}
                <div className="col-span-1">
                  <label
                    htmlFor="pincode"
                    className="block text-[10px] uppercase tracking-wider font-normal text-zinc-500 mb-1.5"
                  >
                    Pin Code
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-xs font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                    placeholder="Zip / Pin code"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start mt-6">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 text-[#106636] border-zinc-300 rounded-none focus:ring-0 focus:ring-offset-0"
                  />
                </div>
                <div className="ml-3 text-xs">
                  <label htmlFor="terms" className="font-normal text-zinc-500">
                    I agree to the{" "}
                    <a href="#terms" className="text-[#724D26] hover:text-[#5a3b1d] transition-colors border-b border-[#724D26]/20">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#privacy" className="text-[#724D26] hover:text-[#5a3b1d] transition-colors border-b border-[#724D26]/20">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
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
                      Creating Account...
                    </div>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-200/50 text-center">
            <span className="text-xs text-zinc-500 font-normal">Already have an account? </span>
            <button
              onClick={() => router.push("/signin")}
              className="text-xs font-normal text-[#724D26] hover:text-[#5a3b1d] transition-colors border-b border-[#724D26]/40 pb-0.5"
            >
              Sign In Instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
