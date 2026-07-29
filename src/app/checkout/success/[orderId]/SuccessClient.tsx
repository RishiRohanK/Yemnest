"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuccessClient({ order }: { order: any }) {
  const [items, setItems] = useState<any[]>([]);
  
  useEffect(() => {
    try {
      setItems(JSON.parse(order.items));
    } catch (e) {
      setItems([]);
    }
  }, [order.items]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans py-16 flex items-center justify-center">
      <div className="max-w-2xl w-full px-4 sm:px-6">
        
        <div className="bg-white border border-zinc-200 shadow-xl p-8 md:p-16 text-center rounded-none relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#106636]" />
          
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-8">
            <svg className="h-8 w-8 text-[#106636]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-light tracking-tight mb-2">Order Confirmed</h1>
          <p className="text-zinc-500 text-sm mb-10 leading-relaxed">
            Thank you, {order.userName}. We have received your order details and payment submission.
          </p>

          <div className="bg-zinc-50 p-6 border border-zinc-100 text-left mb-10 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
              <span className="text-xs text-zinc-500 uppercase tracking-widest">Order Number</span>
              <span className="text-sm font-semibold">{order.id.slice(0,12).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
              <span className="text-xs text-zinc-500 uppercase tracking-widest">Total Amount</span>
              <span className="text-sm font-semibold text-[#106636]">₹{order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
              <span className="text-xs text-zinc-500 uppercase tracking-widest">Payment Status</span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 uppercase tracking-widest">{order.status}</span>
            </div>
            {order.transactionId && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Transaction ID</span>
                <span className="text-xs font-medium">{order.transactionId}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Link 
              href="/collections"
              className="w-full py-4 border border-zinc-200 text-zinc-600 text-xs uppercase tracking-widest font-semibold hover:border-zinc-800 hover:text-zinc-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
