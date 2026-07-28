export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-zinc-200 shadow-sm">
        <h1 className="text-3xl font-light text-zinc-900 mb-8 tracking-wide">Terms of Service</h1>
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>Welcome to Yemnest. By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
          
          <div>
            <h2 className="text-xl text-zinc-900 mt-8 mb-4 font-light">Products and Pricing</h2>
            <p>All products listed on the site are subject to change, including pricing and availability. We reserve the right to limit the sales of our products to any person, geographic region, or jurisdiction.</p>
          </div>

          <div>
            <h2 className="text-xl text-zinc-900 mt-8 mb-4 font-light">Accuracy of Information</h2>
            <p>We are not responsible if information made available on this site is not accurate, complete, or current. The material on this site is provided for general information only.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
