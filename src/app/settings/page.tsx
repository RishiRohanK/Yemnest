"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data);
        } else {
          router.push("/signin");
        }
      })
      .catch(() => router.push("/signin"));
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#106636] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-900 mb-2">
          Settings
        </h1>
        <p className="text-sm text-zinc-500 mb-10">
          Manage your account preferences and security.
        </p>

        <div className="flex flex-col gap-4 max-w-lg mx-auto">
          {/* Personal Details Button */}
          <Link href="/profile" className="flex items-center justify-between w-full bg-white border border-zinc-200 text-zinc-900 p-4 rounded-sm hover:border-[#106636] hover:shadow-md transition-all duration-200 font-medium">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Personal Details</span>
            </div>
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>



          {/* Sign Out Button */}
          <button 
            onClick={async () => {
              localStorage.removeItem("yemnest_user");
              await fetch("/api/auth/logout", { method: "POST" });
              window.dispatchEvent(new Event("yemnest_auth_updated"));
              window.location.href = "/";
            }}
            className="mt-6 flex items-center justify-center w-full bg-[#106636] text-white p-4 rounded-sm hover:bg-[#0c4e29] transition-all duration-200 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
