"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutClient() {
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    altPhone: "",
    houseNo: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("yemnest_cart_items");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      const storedUser = localStorage.getItem("yemnest_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        setUser(u);
        setFormData((prev) => ({
          ...prev,
          name: u.name || "",
          email: u.email || "",
          phone: u.phoneNumber || "",
          houseNo: u.houseNo || "",
          addressLine1: u.addressLine1 || "",
          pincode: u.pincode || "",
        }));
      }
    }
  }, []);

  const subTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subTotal * 0.05; // 5% GST Mock
  const shipping = subTotal > 2000 ? 0 : 150; 
  const total = subTotal + tax + shipping - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "YEMNEST10") {
      setDiscount(subTotal * 0.1);
    } else {
      setDiscount(0);
      alert("Invalid coupon code");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          userName: formData.name,
          userEmail: formData.email,
          houseNo: formData.houseNo,
          addressLine1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phoneNumber: formData.phone,
          alternativeMobileNumber: formData.altPhone,
          items: cartItems.map(i => ({
            id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity
          })),
          subTotal,
          tax,
          shipping,
          discount,
          totalPrice: total,
          couponCode: discount > 0 ? couponCode : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      router.push(`/checkout/payment/${data.orderId}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light tracking-tight mb-8">Secure Checkout</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-8 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Form Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-8 border border-zinc-200 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[#724D26] mb-6 border-b border-zinc-100 pb-2">Customer Details</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Full Name *</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-zinc-300 p-2 text-sm focus:outline-none focus:border-[#106636]" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-zinc-300 p-2 text-sm focus:outline-none focus:border-[#106636]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Phone Number *</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-zinc-300 p-2 text-sm focus:outline-none focus:border-[#106636]" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Alternative Phone (Optional)</label>
                    <input name="altPhone" value={formData.altPhone} onChange={handleInputChange} className="w-full border border-zinc-300 p-2 text-sm focus:outline-none focus:border-[#106636]" />
                  </div>
                </div>

                <h2 className="text-sm font-semibold uppercase tracking-widest text-[#724D26] mb-6 mt-8 border-b border-zinc-100 pb-2">Shipping Address</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">House/Flat No *</label>
                    <input required name="houseNo" value={formData.houseNo} onChange={handleInputChange} className="w-full border border-zinc-300 p-2 text-sm focus:outline-none focus:border-[#106636]" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Street Address *</label>
                    <input required name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} className="w-full border border-zinc-300 p-2 text-sm focus:outline-none focus:border-[#106636]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">City *</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-zinc-300 p-2 text-sm focus:outline-none focus:border-[#106636]" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">State *</label>
                    <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full border border-zinc-300 p-2 text-sm focus:outline-none focus:border-[#106636]" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Pincode *</label>
                    <input required name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full border border-zinc-300 p-2 text-sm focus:outline-none focus:border-[#106636]" />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-zinc-200 shadow-sm sticky top-24">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[#724D26] mb-6 border-b border-zinc-100 pb-2">Order Summary</h2>
              
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-6">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-[#106636]">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Estimated Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mb-6 border-t border-b border-zinc-100 py-4">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon Code" 
                  className="flex-1 border border-zinc-300 p-2 text-sm focus:outline-none focus:border-[#106636]" 
                />
                <button type="button" onClick={handleApplyCoupon} className="bg-zinc-200 px-4 text-xs font-semibold uppercase hover:bg-zinc-300 transition-colors">Apply</button>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-medium text-lg">Total</span>
                <span className="text-2xl font-semibold text-[#106636]">₹{total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading || cartItems.length === 0}
                className="w-full py-4 bg-[#106636] text-white text-xs uppercase tracking-widest font-semibold hover:bg-zinc-900 transition-colors disabled:bg-zinc-400"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Encrypted Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
