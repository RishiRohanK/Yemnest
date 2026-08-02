export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-zinc-200 shadow-sm">
        <h1 className="text-3xl font-light text-zinc-900 mb-8 tracking-wide">Contact Us</h1>
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>We'd love to hear from you! If you have any questions, concerns, or feedback, please reach out to us using the contact information below.</p>
          
          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Email</h2>
            <p>You can email us anytime at: <strong>support@yemnest.com</strong></p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">WhatsApp</h2>
            <p>For immediate assistance, message us on WhatsApp at: <strong>+91 9876543210</strong></p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Business Hours</h2>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday - Sunday: Closed</p>
          </div>
        </div>
      </div>
    </main>
  );
}
