export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-zinc-200 shadow-sm">
        <h1 className="text-3xl font-light text-zinc-900 mb-8 tracking-wide">Privacy Policy</h1>
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>At Yemnest, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our store.</p>
          
          <div>
            <h2 className="text-xl text-zinc-900 mt-8 mb-4 font-light">Information We Collect</h2>
            <p>When you visit the site, we automatically collect certain information about your device. Additionally, when you make a purchase, we collect order information including your name, billing address, shipping address, payment information, email address, and phone number.</p>
          </div>

          <div>
            <h2 className="text-xl text-zinc-900 mt-8 mb-4 font-light">How We Use Your Information</h2>
            <p>We use the Order Information that we collect generally to fulfill any orders placed through the site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
          </div>
        </div>
      </div>
    </main>
  );
}
