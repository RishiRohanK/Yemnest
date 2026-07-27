"use client";

import { useState } from "react";
import Link from "next/link";
import TopBanner from "../../../components/topbanner";

interface OrderTrackingData {
  id: string;
  status: string;
  createdAt: string;
  items: string;
  totalPrice: number;
  deliveredAt?: string;
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsLoading(true);
    setError("");
    setOrderData(null);

    try {
      const encodedId = encodeURIComponent(orderId.trim());
      const res = await fetch(`/api/track/${encodedId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Order not found. Please check your Order ID.");
        throw new Error("Failed to fetch order status.");
      }
      const data = await res.json();
      setOrderData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const parseItems = (itemsJson: string) => {
    try {
      return JSON.parse(itemsJson);
    } catch (e) {
      return [];
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] font-sans flex flex-col">
      <TopBanner />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-zinc-200 p-8 shadow-sm">
          <h1 className="text-2xl font-light text-zinc-900 text-center mb-2">Track Your Order</h1>
          <p className="text-xs text-zinc-500 text-center mb-8">Enter the Order ID you received after checkout to see its current status.</p>

          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-1">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs text-zinc-900 placeholder:text-zinc-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !orderId}
              className="w-full bg-[#106636] text-white px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-zinc-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Track Order"}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs text-center animate-fade-in">
              {error}
            </div>
          )}

          {orderData && (
            <div className="mt-8 pt-8 border-t border-zinc-100 animate-fade-in">
              <h2 className="text-sm font-semibold text-zinc-800 mb-4 uppercase tracking-widest">Order Details</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Status:</span>
                  <span className={`font-semibold px-2 py-0.5 text-xs ${
                    orderData.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                    orderData.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700' :
                    orderData.status === 'DELIVERED' ? 'bg-green-50 text-green-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {orderData.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Date Ordered:</span>
                  <span className="text-zinc-800 font-medium">
                    {new Date(orderData.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {orderData.status === "DELIVERED" ? (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Delivered On:</span>
                    <span className="text-zinc-800 font-medium">
                      {orderData.deliveredAt 
                        ? new Date(orderData.deliveredAt).toLocaleDateString()
                        : new Date().toLocaleDateString()
                      }
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Est. Delivery:</span>
                    <span className="text-zinc-800 font-medium">
                      {new Date(new Date(orderData.createdAt).setDate(new Date(orderData.createdAt).getDate() + 5)).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Total Price:</span>
                  <span className="text-zinc-800 font-medium">
                    ₹{orderData.totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Items</span>
                  <ul className="space-y-2">
                    {parseItems(orderData.items).map((item: any, idx: number) => {
                      const itemName = item.name || item.product?.name || "Unknown Product";
                      const itemPrice = item.price || item.product?.price || 0;
                      return (
                        <li key={idx} className="flex justify-between text-xs text-zinc-700">
                          <span>{item.quantity}x {itemName}</span>
                          <span>₹{(itemPrice * item.quantity).toFixed(2)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <Link href="/shop" className="text-xs text-[#106636] uppercase tracking-widest hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
