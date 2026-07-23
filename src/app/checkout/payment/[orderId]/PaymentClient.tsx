"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PaymentClient({ order }: { order: any }) {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const merchantUpiId = "yemnest@merchant"; // Replace with real UPI ID
  const merchantName = "Yemnest Chocolates";
  const amountStr = order.totalPrice.toFixed(2);
  
  // UPI Deep link
  const upiLink = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amountStr}&cu=INR`;
  
  // Mock QR generation URL (using an open API for demo purposes)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          transactionId,
          paymentScreenshot
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update payment");

      // Clear purchased items from wishlist
      try {
        const storedWishlist = localStorage.getItem("yemnest_wishlist");
        if (storedWishlist && order?.items) {
          const wishlistItems = JSON.parse(storedWishlist);
          const purchasedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
          const purchasedIds = purchasedItems.map((i: any) => i.id || i.productId);
          const newWishlist = wishlistItems.filter((item: any) => !purchasedIds.includes(item.id));
          localStorage.setItem("yemnest_wishlist", JSON.stringify(newWishlist));
          window.dispatchEvent(new Event("yemnest_wishlist_updated"));
        }
      } catch (err) {
        console.error("Failed to clear wishlist items", err);
      }

      // Clear local cart
      localStorage.setItem("yemnest_cart_items", JSON.stringify([]));
      localStorage.setItem("yemnest_cart_count", "0");
      window.dispatchEvent(new Event("yemnest_cart_updated"));

      router.push(`/checkout/success/${order.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <span className="text-[#106636] text-[10px] uppercase tracking-widest font-semibold block mb-2">Step 2 of 3</span>
          <h1 className="text-3xl font-light tracking-tight">Complete Payment</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-8 text-sm text-center">
            {error}
          </div>
        )}

        <div className="bg-white border border-zinc-200 shadow-sm p-8 md:p-12 mb-8">
          
          {/* Order Brief */}
          <div className="flex justify-between items-center border-b border-zinc-100 pb-6 mb-8 text-center">
            <div className="flex-1">
              <span className="text-xs text-zinc-400 block mb-1 uppercase tracking-widest">Order ID</span>
              <span className="text-sm font-semibold">{order.id.slice(0,8).toUpperCase()}</span>
            </div>
            <div className="w-px h-10 bg-zinc-200 mx-4" />
            <div className="flex-1">
              <span className="text-xs text-zinc-400 block mb-1 uppercase tracking-widest">Amount to Pay</span>
              <span className="text-2xl font-semibold text-[#106636]">₹{amountStr}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left: QR Code & UPI Links */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[#724D26] mb-6">Scan to Pay</h3>
              
              <div className="bg-white p-4 border border-zinc-200 shadow-sm rounded-xl mb-6">
                <Image src={qrUrl} alt="UPI QR Code" width={200} height={200} />
              </div>

              <div className="w-full flex items-center justify-between bg-zinc-50 border border-zinc-200 p-3 mb-6">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase tracking-widest mb-0.5">UPI ID</span>
                  <span className="text-sm font-medium">{merchantUpiId}</span>
                </div>
                <button onClick={handleCopy} className="text-xs text-[#106636] font-semibold uppercase hover:underline">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <h4 className="text-xs text-zinc-400 uppercase tracking-widest mb-4">Or Pay via App</h4>
              <div className="flex gap-4">
                <a href={upiLink} className="flex-1 flex flex-col items-center gap-2 p-3 border border-zinc-200 hover:border-[#106636] transition-colors rounded-lg">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">GPay</span>
                </a>
                <a href={upiLink} className="flex-1 flex flex-col items-center gap-2 p-3 border border-zinc-200 hover:border-[#106636] transition-colors rounded-lg">
                  <span className="text-xl font-bold text-purple-600">PhPe</span>
                </a>
              </div>
            </div>

            {/* Right: Verification Form */}
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[#724D26] mb-6">Verify Payment</h3>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                Once you have completed the payment via the QR code or UPI link, please click "I have completed payment" below. Providing the Transaction ID helps us confirm your order instantly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 mt-auto">
                <div>
                  <label className="block text-xs text-zinc-500 mb-2">UPI Reference Number / Transaction ID (Optional)</label>
                  <input 
                    name="transactionId" 
                    value={transactionId} 
                    onChange={(e) => setTransactionId(e.target.value)} 
                    placeholder="e.g. 325419087621"
                    className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-[#106636]" 
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#106636] text-white text-xs uppercase tracking-widest font-semibold hover:bg-zinc-900 transition-colors disabled:bg-zinc-400 shadow-md"
                >
                  {loading ? "Processing..." : "I have completed payment"}
                </button>
              </form>

              <div className="mt-6 flex items-start gap-3 bg-blue-50 p-4 border border-blue-100 text-blue-800">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs leading-relaxed">
                  Your order is currently locked and marked as Pending. It will be verified by our team within a few minutes after submission.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
