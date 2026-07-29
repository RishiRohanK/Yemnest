"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

interface UserProfile {
  id?: string;
  name: string;
  email: string;
  houseNo?: string;
  addressLine1?: string;
  pincode?: string;
  phoneNumber?: string;
  alternativeMobileNumber?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Profile (Name & Email) Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ 
    name: "", 
    email: "",
    phoneNumber: "",
    alternativeMobileNumber: ""
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState("");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Address Edit State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    houseNo: "",
    addressLine1: "",
    pincode: ""
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressSaveError, setAddressSaveError] = useState("");
  const [addressSaveSuccess, setAddressSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.role === "user" && data.user) {
          const parsed = data.user;
          setUser(parsed);
          setProfileForm({
            name: parsed.name || "",
            email: parsed.email || "",
            phoneNumber: parsed.phoneNumber || "",
            alternativeMobileNumber: parsed.alternativeMobileNumber || ""
          });
          setAddressForm({
            houseNo: parsed.houseNo || "",
            addressLine1: parsed.addressLine1 || "",
            pincode: parsed.pincode || ""
          });
        } else {
          router.push("/signin");
        }
      })
      .catch(() => router.push("/signin"));
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setProfileSaveError("User ID not found. Please sign out and sign in again.");
      return;
    }
    
    setIsSavingProfile(true);
    setProfileSaveError("");
    setProfileSaveSuccess(false);

    try {
      const res = await fetch("/api/profile/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...profileForm
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile details");
      }
      
      // Update local state
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      // Dispatch an event to update the navbar name instantly
      window.dispatchEvent(new Event("yemnest_auth_updated"));
      
      setProfileSaveSuccess(true);
      setIsEditingProfile(false);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
      
    } catch (err: any) {
      setProfileSaveError(err.message || "Something went wrong.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setAddressSaveError("User ID not found. Please sign out and sign in again.");
      return;
    }
    
    setIsSavingAddress(true);
    setAddressSaveError("");
    setAddressSaveSuccess(false);

    try {
      const res = await fetch("/api/profile/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...addressForm
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to update address");
      }
      
      // Update local state
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      
      setAddressSaveSuccess(true);
      setIsEditingAddress(false);
      setTimeout(() => setAddressSaveSuccess(false), 3000);
      
    } catch (err: any) {
      setAddressSaveError(err.message || "Something went wrong.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-900 mb-8">
          My Profile
        </h1>
        
        {/* Account Details Section */}
        <div className="bg-white shadow-sm border-2 border-zinc-200 rounded-3xl p-8 mb-8 relative hover:shadow-md hover:border-[#106636] transition-all duration-300">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
            <h2 className="text-xl font-normal text-zinc-900">Account Details</h2>
            {!isEditingProfile && (
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="text-[#106636] text-sm font-semibold hover:underline"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          {profileSaveSuccess && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-normal rounded-none">
              Account details updated successfully!
            </div>
          )}
          
          {profileSaveError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-normal rounded-none">
              {profileSaveError}
            </div>
          )}

          {!isEditingProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-semibold text-[#8A6F54] uppercase tracking-widest mb-2">Full Name</label>
                <div className="text-zinc-900 text-lg font-medium">{user?.name || "Loading..."}</div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#8A6F54] uppercase tracking-widest mb-2">Email Address</label>
                <div className="text-zinc-900 text-lg font-medium">{user?.email || "Loading..."}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8A6F54] uppercase tracking-widest mb-2">Phone Number</label>
                <div className="text-zinc-900 text-lg font-medium">{user?.phoneNumber || <span className="text-zinc-400 text-sm font-normal">Not provided</span>}</div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#8A6F54] uppercase tracking-widest mb-2">Alternative Phone</label>
                <div className="text-zinc-900 text-lg font-medium">{user?.alternativeMobileNumber || <span className="text-zinc-400 text-sm font-normal">Not provided</span>}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                    className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2">Alternative Phone</label>
                  <input
                    type="tel"
                    value={profileForm.alternativeMobileNumber}
                    onChange={(e) => setProfileForm({...profileForm, alternativeMobileNumber: e.target.value})}
                    className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex-1 flex justify-center py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-normal uppercase tracking-wider text-xs transition-colors duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-none"
                >
                  {isSavingProfile ? "Saving..." : "Save Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  disabled={isSavingProfile}
                  className="flex-1 flex justify-center py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-normal uppercase tracking-wider text-xs transition-colors duration-200 disabled:opacity-50 rounded-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Address Details Section */}
        <div className="bg-white shadow-sm border-2 border-zinc-200 rounded-3xl p-8 mb-8 relative hover:shadow-md hover:border-[#106636] transition-all duration-300">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
            <h2 className="text-xl font-normal text-zinc-900">Address Details</h2>
            {!isEditingAddress && (
              <button 
                onClick={() => setIsEditingAddress(true)}
                className="text-[#106636] text-sm font-semibold hover:underline"
              >
                Edit Address
              </button>
            )}
          </div>
          
          {addressSaveSuccess && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-normal rounded-none">
              Address updated successfully!
            </div>
          )}
          
          {addressSaveError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-normal rounded-none">
              {addressSaveError}
            </div>
          )}

          {!isEditingAddress ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-semibold text-[#8A6F54] uppercase tracking-widest mb-2">House No / Apt</label>
                <div className="text-zinc-900 text-lg font-medium">{user?.houseNo || <span className="text-zinc-400 text-sm font-normal">Not provided</span>}</div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#8A6F54] uppercase tracking-widest mb-2">Address Line 1</label>
                <div className="text-zinc-900 text-lg font-medium">{user?.addressLine1 || <span className="text-zinc-400 text-sm font-normal">Not provided</span>}</div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#8A6F54] uppercase tracking-widest mb-2">Pin Code</label>
                <div className="text-zinc-900 text-lg font-medium">{user?.pincode || <span className="text-zinc-400 text-sm font-normal">Not provided</span>}</div>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSaveAddress} className="space-y-6">
              <div className="mb-4">
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(async (position) => {
                          const { latitude, longitude } = position.coords;
                          try {
                            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                            const data = await res.json();
                            if (data && data.address) {
                              setAddressForm(prev => ({
                                ...prev,
                                houseNo: data.address.house_number || "",
                                pincode: data.address.postcode || "",
                                addressLine1: data.display_name || ""
                              }));
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        });
                      }
                    }}
                    className="cursor-pointer flex items-center gap-2 text-xs font-medium text-[#106636] hover:underline bg-[#106636]/10 px-3 py-1.5 rounded-full"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Use Current Location
                  </button>
                </div>
                <MapPicker 
                  onLocationSelect={(data) => {
                    setAddressForm(prev => ({
                      ...prev,
                      houseNo: data.address.house_number || "",
                      pincode: data.address.postcode || "",
                      addressLine1: data.display_name || ""
                    }));
                  }} 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2">House No</label>
                  <input
                    type="text"
                    required
                    value={addressForm.houseNo}
                    onChange={(e) => setAddressForm({...addressForm, houseNo: e.target.value})}
                    className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2">Address Line 1</label>
                  <input
                    type="text"
                    required
                    value={addressForm.addressLine1}
                    onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                    className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider font-normal text-zinc-600 mb-2">Pin Code</label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                    className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm font-normal focus:outline-none focus:border-[#106636] focus:bg-white transition-colors duration-200 rounded-none"
                  />
                </div>
                
              </div>
              
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="flex-1 flex justify-center py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-normal uppercase tracking-wider text-xs transition-colors duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-none"
                >
                  {isSavingAddress ? "Saving..." : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  disabled={isSavingAddress}
                  className="flex-1 flex justify-center py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-normal uppercase tracking-wider text-xs transition-colors duration-200 disabled:opacity-50 rounded-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
