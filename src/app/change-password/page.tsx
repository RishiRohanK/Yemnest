"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{type: "error" | "success" | "", message: string}>({type: "", message: ""});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({type: "", message: ""});

    if (!newPassword || !confirmPassword) {
      setStatus({type: "error", message: "Please fill in all fields."});
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({type: "error", message: "New passwords do not match."});
      return;
    }

    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setStatus({type: "success", message: "Password updated successfully!"});
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900 text-center mb-2">
          Change Password
        </h1>
        <p className="text-center text-xs text-zinc-500 uppercase tracking-widest mb-8">
          Secure your account
        </p>
        
        <div className="bg-white shadow-sm border border-zinc-200/40 rounded-3xl p-8">
          {status.message && (
            <div className={`p-3 mb-6 text-xs font-normal rounded-none border ${status.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || status.type === "success"}
              className="w-full flex justify-center py-3 px-4 mt-2 bg-zinc-900 hover:bg-zinc-800 text-white font-normal uppercase tracking-wider text-xs transition-colors duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-none"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/profile")}
              className="text-xs font-normal text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              Cancel & Return to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
