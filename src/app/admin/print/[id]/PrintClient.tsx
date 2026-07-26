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
    <div id="printable-invoice" className="bg-white text-black font-sans p-8">
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
            padding: 0;
            margin: 0;
          }
          @page {
            size: auto;
            margin: 10mm;
          }
        }
      `}} />
      <div className="max-w-3xl mx-auto border border-zinc-200 p-10 print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-black tracking-widest uppercase mb-1">Yemnest</h1>
            <p className="text-sm text-zinc-600 font-medium">Premium Handcrafted Chocolates</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-black">INVOICE</h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">ORDER ID: {order.id}</p>
            <p className="text-xs text-zinc-500 font-medium">{orderDate}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex justify-between mb-8">
          <div className="w-1/2 pr-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Ship To:</h3>
            <p className="text-sm font-bold text-black uppercase">{order.userName}</p>
            <p className="text-sm text-black mt-1">
              {order.houseNo}, {order.addressLine1}
            </p>
            <p className="text-sm text-black">Pincode: {order.pincode}</p>
          </div>
          <div className="w-1/2 pl-4 border-l border-zinc-200">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Contact Details:</h3>
            <p className="text-sm text-black">Email: {order.userEmail}</p>
            <p className="text-sm text-black">Phone 1: {order.phoneNumber}</p>
            {order.alternativeMobileNumber && (
              <p className="text-sm text-black">Phone 2: {order.alternativeMobileNumber}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-zinc-50">
                <th className="py-3 px-2 text-left text-xs uppercase tracking-widest font-bold text-black">Item Description</th>
                <th className="py-3 px-2 text-center text-xs uppercase tracking-widest font-bold text-black">Quantity</th>
                <th className="py-3 px-2 text-right text-xs uppercase tracking-widest font-bold text-black">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-zinc-200">
                  <td className="py-4 px-2">
                    <p className="text-sm font-semibold text-black">{item.name}</p>
                    {item.price && (
                      <p className="text-[10px] text-zinc-500">Unit Price: ₹{item.price.toFixed(2)}</p>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center text-sm font-bold text-black">{item.quantity}</td>
                  <td className="py-4 px-2 text-right text-sm font-bold text-black">
                    ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total & Footer */}
        <div className="flex justify-between items-end border-t-2 border-black pt-6">
          <div className="w-1/2">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Thank you for your business!</p>
            <p className="text-xs text-black italic">For any queries, please contact support@yemnest.com</p>
          </div>
          <div className="text-right w-1/2">
            <p className="text-sm uppercase tracking-widest text-zinc-500 mb-1 font-bold">Total Amount Paid</p>
            <p className="text-3xl font-bold text-black">₹{order.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Internal Packing Use Only - Hidden on web, visible on print */}
        <div className="mt-16 pt-8 border-t border-dashed border-zinc-400 text-center">
          <p className="text-[9px] uppercase tracking-widest text-zinc-400">--- Internal Packing Slip ---</p>
          <div className="flex justify-around mt-4">
            <div className="border border-black p-4 w-32 h-16 flex items-center justify-center">
              <span className="text-[8px] uppercase tracking-widest text-zinc-400">Packed By</span>
            </div>
            <div className="border border-black p-4 w-32 h-16 flex items-center justify-center">
              <span className="text-[8px] uppercase tracking-widest text-zinc-400">QC Checked By</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
