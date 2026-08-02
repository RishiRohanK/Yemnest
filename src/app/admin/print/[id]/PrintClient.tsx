"use client";

import { useEffect } from "react";
import Image from "next/image";

interface PrintClientProps {
  order: any;
  items: any[];
  orderDate: string;
}

export default function PrintClient({ order, items, orderDate }: PrintClientProps) {
  useEffect(() => {
    // Automatically trigger print dialog on load
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, []);

  return (
    <div id="printable-invoice" className="bg-white text-zinc-900 font-sans p-2">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            padding: 10mm;
            margin: 0;
            background-color: white !important;
          }
          @page {
            size: auto;
            margin: 0;
          }
          .print-exact {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />
      <div className="max-w-4xl mx-auto border border-zinc-100 shadow-sm p-4 print:border-none print:shadow-none print:p-0 bg-white">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-[#724D26] pb-2 mb-3">
          <div>
            {/* Logo */}
            <div className="relative h-8 w-32 mb-1">
              <Image 
                src="https://ik.imagekit.io/dypkhqxip/yemnestnavbar" 
                alt="Yemnest" 
                fill 
                className="object-contain object-left"
                unoptimized
              />
            </div>
            <p className="text-[10px] text-zinc-500 font-serif italic tracking-wide">Premium Handcrafted Chocolates</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-serif font-semibold tracking-widest text-[#106636] uppercase mb-1">Invoice</h2>
            <div className="bg-zinc-50 p-1.5 rounded border border-zinc-100 print-exact inline-block text-left">
              <p className="text-[9px] text-zinc-500 font-medium"><span className="w-12 inline-block uppercase tracking-wider">Order:</span> <span className="font-mono text-zinc-800">#{order.id.slice(0, 12).toUpperCase()}</span></p>
              <p className="text-[9px] text-zinc-500 font-medium"><span className="w-12 inline-block uppercase tracking-wider">Date:</span> <span className="text-zinc-800">{orderDate}</span></p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex gap-4 mb-3">
          <div className="w-1/2 bg-[#FAF9F6] p-3 rounded border border-zinc-100 print-exact">
            <h3 className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#724D26] mb-1.5 flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Shipping Address
            </h3>
            <p className="text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-0.5">{order.userName}</p>
            <div className="text-[10px] text-zinc-600 space-y-0.5 mt-1">
              <p>{order.houseNo}, {order.addressLine1}</p>
              <p>Pincode: <span className="font-medium text-zinc-800">{order.pincode}</span></p>
            </div>
          </div>
          
          <div className="w-1/2 bg-[#FAF9F6] p-3 rounded border border-zinc-100 print-exact">
            <h3 className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#724D26] mb-1.5 flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Contact Details
            </h3>
            <div className="text-[10px] text-zinc-600 space-y-0.5 mt-1">
              <p className="flex items-center gap-2">
                <span className="text-zinc-400">Email:</span> 
                <span className="font-medium text-zinc-800">{order.userEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-zinc-400">Phone 1:</span> 
                <span className="font-medium text-zinc-800">{order.phoneNumber}</span>
              </p>
              {order.alternativeMobileNumber && (
                <p className="flex items-center gap-2">
                  <span className="text-zinc-400">Phone 2:</span> 
                  <span className="font-medium text-zinc-800">{order.alternativeMobileNumber}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-3">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#724D26] text-white print-exact rounded-t-lg overflow-hidden">
                <th className="py-1 px-2 text-left text-[9px] uppercase tracking-widest font-medium rounded-tl-lg">Item Description</th>
                <th className="py-1 px-2 text-center text-[9px] uppercase tracking-widest font-medium">Qty</th>
                <th className="py-1 px-2 text-right text-[9px] uppercase tracking-widest font-medium rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-zinc-200 hover:bg-zinc-50 transition-colors">
                  <td className="py-2 px-2">
                    <p className="text-xs font-medium text-zinc-900">{item.name}</p>
                    {item.price && (
                      <p className="text-[9px] text-zinc-400">Unit Price: ₹{item.price.toFixed(2)}</p>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center text-xs font-semibold text-zinc-700 bg-zinc-50/50 print-exact">{item.quantity}</td>
                  <td className="py-2 px-2 text-right text-xs font-semibold text-[#106636]">
                    ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total & Footer */}
        <div className="flex justify-between items-end border-t border-zinc-200 pt-2 mt-2">
          <div className="w-1/2 pr-4">
            <h4 className="text-[11px] font-serif italic text-zinc-600 mb-0.5">Thank you for your business!</h4>
            <p className="text-[9px] text-zinc-400 leading-relaxed">
              We hope you enjoy your premium handcrafted chocolates. 
              For any queries, please contact <span className="font-medium text-zinc-600">support@yemnest.com</span>
            </p>
          </div>
          <div className="w-1/2 bg-[#FAF9F6] p-2.5 rounded-lg border border-zinc-200 text-right print-exact">
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-0.5 font-semibold">Total Amount Paid</p>
            <p className="text-xl font-serif font-bold text-[#724D26]">₹{order.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Internal Packing Use Only - Hidden on web, visible on print */}
        <div className="mt-4 pt-3 border-t-2 border-dashed border-zinc-300 text-center relative">
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-2 text-[8px] uppercase tracking-widest text-zinc-400 font-semibold print-exact">
            Internal Packing Slip
          </span>
          <div className="flex justify-center gap-4 mt-2">
            <div className="border border-zinc-200 rounded p-1.5 w-24 h-10 flex flex-col items-center justify-end relative">
              <span className="text-[7px] uppercase tracking-widest text-zinc-400 absolute top-1 left-1">Packed By</span>
              <div className="w-full border-b border-zinc-300 mb-1"></div>
            </div>
            <div className="border border-zinc-200 rounded p-1.5 w-24 h-10 flex flex-col items-center justify-end relative">
              <span className="text-[7px] uppercase tracking-widest text-zinc-400 absolute top-1 left-1">QC Checked By</span>
              <div className="w-full border-b border-zinc-300 mb-1"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
