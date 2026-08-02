export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-zinc-200 shadow-sm">
        <h1 className="text-3xl font-light text-zinc-900 mb-8 tracking-wide">Shipping Policy</h1>
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>Thank you for shopping with Yemnest. This Shipping Policy outlines our standard processing and delivery terms.</p>
          
          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Processing Time</h2>
            <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Shipping Rates and Estimates</h2>
            <p>We offer flat-rate shipping for all domestic orders. Shipping charges for your order will be calculated and displayed at checkout.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">In-Store Pickup</h2>
            <p>You can skip the shipping fees with free local pickup at our store. After placing your order and selecting local pickup at checkout, your order will be prepared and ready for pick up within 1 business day.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
