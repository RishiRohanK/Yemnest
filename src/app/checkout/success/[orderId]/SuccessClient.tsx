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

  const handleNotifyWhatsApp = () => {
    let messageText = `*New Order placed at Yemnest!*\n\n`;
    messageText += `*Order ID:* ${order.id}\n`;
    messageText += `*Status:* ${order.status}\n`;
    messageText += `*Transaction ID:* ${order.transactionId || "N/A"}\n\n`;
    
    messageText += `*Customer Info:*\n`;
    messageText += `• Name: ${order.userName}\n`;
    messageText += `• Email: ${order.userEmail}\n`;
    messageText += `• Phone: ${order.phoneNumber}\n`;
    if (order.alternativeMobileNumber) {
      messageText += `• Alt Phone: ${order.alternativeMobileNumber}\n`;
    }
    messageText += `\n`;
    
    messageText += `*Shipping Address:*\n`;
    messageText += `• House No: ${order.houseNo}\n`;
    messageText += `• Street: ${order.addressLine1}\n`;
    messageText += `• City: ${order.city}\n`;
    messageText += `• State: ${order.state}\n`;
    messageText += `• Pin Code: ${order.pincode}\n\n`;

    messageText += `*Products Ordered:*\n`;
    items.forEach((item) => {
      messageText += `• ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    messageText += `\n`;
    messageText += `• Subtotal: ₹${order.subTotal?.toFixed(2)}\n`;
    messageText += `• Tax: ₹${order.tax?.toFixed(2)}\n`;
    messageText += `• Shipping: ₹${order.shipping?.toFixed(2)}\n`;
    if (order.discount > 0) {
      messageText += `• Discount: -₹${order.discount?.toFixed(2)}\n`;
    }
    messageText += `\n*Total Paid:* ₹${order.totalPrice.toFixed(2)}\n\n`;
    messageText += `Please confirm my order and payment verification. Thank you!`;

    const whatsappNumber = "919876543210"; // Placeholder shop WhatsApp number
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;
    
    window.open(whatsappUrl, "_blank");
  };

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
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 uppercase tracking-widest">Pending Verification</span>
            </div>
            {order.transactionId && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Transaction ID</span>
                <span className="text-xs font-medium">{order.transactionId}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-zinc-500 mb-6">
            Estimated verification time: <strong className="text-zinc-800">5-10 minutes</strong>. 
          </p>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleNotifyWhatsApp}
              className="w-full py-4 bg-[#25D366] text-white text-xs uppercase tracking-widest font-bold hover:bg-[#1DA851] transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 0C5.385 0 0 5.385 0 12.032c0 2.128.555 4.156 1.611 5.962L.15 23.332l5.474-1.436c1.745 1.011 3.737 1.543 5.795 1.543 6.645 0 12.031-5.386 12.031-12.031C23.45 5.385 18.066 0 12.031 0zm3.896 17.202c-1.393.755-3.033.454-4.22-.387-2.158-1.523-3.666-3.715-4.498-6.195-.366-1.089-.258-2.348.514-3.323.518-.654 1.258-1.01 2.05-1.01.693 0 1.341.342 1.761.92.51.698.814 1.545.922 2.428.063.504-.08 1.012-.39 1.417-.306.4-.738.653-1.22.756-.372.079-.76-.051-1.026-.339-.304-.326-.65-.632-1.03-.895 1.137 2.016 2.766 3.655 4.887 4.673-.3-.38-.633-.74-.98-1.083-.243-.24-.543-.377-.853-.41-.397-.042-.792.083-1.127.352-.437.354-.77.85-1.002 1.406-.217.518-.25 1.11-.115 1.65.176.711.69 1.298 1.378 1.558.745.281 1.62-.008 2.18-.58l1.782-1.815z" />
              </svg>
              Notify us on WhatsApp
            </button>
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
