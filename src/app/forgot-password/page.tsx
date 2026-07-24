"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{type: "error" | "success" | "", message: string}>({type: "", message: ""});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({type: "", message: ""});

    if (!email) {
      setStatus({type: "error", message: "Please enter your email address."});
      return;
    }

    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setStatus({type: "success", message: "If an account exists with this email, a reset link has been sent."});
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900 text-center mb-2">
          Reset Password
        </h1>
        <p className="text-center text-xs text-zinc-500 uppercase tracking-widest mb-8">
          We'll send you recovery instructions
        </p>
        
        <div className="bg-white shadow-sm border border-zinc-200/40 rounded-3xl p-8">
          {status.message && (
            <div className={`p-3 mb-6 text-xs font-normal rounded-none border ${status.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {status.message}
            </div>
          )}

          {!status.message || status.type !== "success" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 mt-2 bg-zinc-900 hover:bg-zinc-800 text-white font-normal uppercase tracking-wider text-xs transition-colors duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-none"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <button
              onClick={() => router.push("/signin")}
              className="w-full flex justify-center py-3 px-4 mt-2 bg-[#106636] hover:bg-[#0a4424] text-white font-normal uppercase tracking-wider text-xs transition-colors duration-200 rounded-none"
            >
              Return to Sign In
            </button>
          )}
          
          <div className="mt-6 text-center">
            <Link
              href="/signin"
              className="text-xs font-normal text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
