export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-zinc-200 shadow-sm">
        <h1 className="text-3xl font-light text-zinc-900 mb-8 tracking-wide">Returns & Refunds</h1>
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>We want you to be completely satisfied with your purchase from Yemnest. Due to the perishable nature of our artisanal chocolates and sweets, we handle returns on a case-by-case basis.</p>
          
          <div>
            <h2 className="text-xl text-zinc-900 mt-8 mb-4 font-light">Damaged or Incorrect Items</h2>
            <p>If your order arrives damaged or if you receive an incorrect item, please contact us within 24 hours of delivery. Include your order number and photos of the damaged or incorrect item, and we will arrange a replacement or refund.</p>
          </div>

          <div>
            <h2 className="text-xl text-zinc-900 mt-8 mb-4 font-light">Refunds</h2>
            <p>Once your return or claim is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
