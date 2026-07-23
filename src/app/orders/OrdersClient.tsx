"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OrdersClient() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = localStorage.getItem("yemnest_user");
      if (!storedUser) {
        router.push("/signin");
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 border-b border-zinc-200 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-zinc-900">My Orders</h1>
            <p className="text-sm text-zinc-500 mt-2">View and track your recent purchases.</p>
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-widest text-[#106636] font-semibold hover:underline">
            Continue Shopping
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-8 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-zinc-400 animate-pulse">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-zinc-200 py-24 text-center shadow-sm">
            <svg className="w-12 h-12 text-zinc-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No orders found</h3>
            <p className="text-sm text-zinc-500 mb-6">You haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="inline-block bg-[#106636] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-zinc-900 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
              
              return (
                <div key={order.id} className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
                  
                  {/* Order Header */}
                  <div className="bg-zinc-50/80 px-6 py-4 border-b border-zinc-200 flex flex-wrap gap-y-4 justify-between items-center text-sm">
                    <div className="flex gap-8">
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Order Placed</span>
                        <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Total</span>
                        <span className="font-medium text-[#106636]">₹{order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Order ID</span>
                      <span className="font-medium text-zinc-700">#{order.id.slice(0,8).toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-semibold uppercase tracking-widest text-[#724D26]">
                        Status: <span className="text-[#106636] ml-2">{order.status}</span>
                      </h4>
                    </div>

                    <div className="space-y-6">
                      {items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <div className="w-20 h-24 bg-zinc-100 flex-shrink-0 relative border border-zinc-200">
                            {/* In a real scenario, you'd save image URL in order items too. Assuming it's missing, we just show a placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-zinc-400 uppercase tracking-widest text-center px-2">
                              Yemnest
                            </div>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-zinc-900 text-sm mb-1">{item.name}</h5>
                            <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-[#106636]">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Bar */}
                  <div className="bg-zinc-50/50 px-6 py-3 border-t border-zinc-100 flex justify-end">
                     <Link href={`/checkout/success/${order.id}`} className="text-xs text-[#106636] font-medium hover:underline">
                        View Order Details
                     </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
