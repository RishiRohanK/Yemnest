export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-zinc-200 shadow-sm">
        <h1 className="text-3xl font-light text-zinc-900 mb-2 tracking-wide">Terms and Conditions</h1>
        <p className="text-sm text-zinc-500 mb-8">Effective Date: 02-08-2026</p>
        
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>Welcome to <strong>Yemnest</strong></p>
          <p>By accessing or using our website, you agree to these Terms and Conditions.</p>
          
          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Eligibility</h2>
            <p>You must be at least 18 years old or have permission from a parent or legal guardian to use this website.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Products</h2>
            <p>We make every effort to display our products accurately. Due to differences in screen settings and the handmade nature of our chocolates and desserts, slight variations in appearance may occur.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Pricing</h2>
            <p>All prices are displayed in Indian Rupees (INR) unless otherwise stated.</p>
            <p>Prices may change without prior notice.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Orders</h2>
            <p>We reserve the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Accept or reject any order</li>
              <li>Cancel suspected fraudulent transactions</li>
              <li>Limit purchase quantities</li>
            </ul>
            <p className="mt-4">If an order is cancelled after payment, the eligible amount will be refunded according to our Refund Policy.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Delivery</h2>
            <p>Delivery times are estimates and may vary due to weather, traffic, courier delays, holidays, or unforeseen circumstances.</p>
            <p>Customers are responsible for providing accurate delivery information.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Product Storage</h2>
            <p>Our chocolates and desserts are perishable.</p>
            <p>Customers should:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Refrigerate products as recommended</li>
              <li>Consume products within the suggested shelf life</li>
              <li>Follow storage instructions provided with the product</li>
            </ul>
            <p className="mt-4">We are not responsible for damage caused by improper storage after delivery.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Allergies</h2>
            <p>Our products may contain or come into contact with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Milk</li>
              <li>Nuts</li>
              <li>Wheat</li>
              <li>Soy</li>
              <li>Eggs</li>
              <li>Sesame</li>
              <li>Other allergens</li>
            </ul>
            <p className="mt-4">Customers with food allergies should contact us before placing an order.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Intellectual Property</h2>
            <p>All website content including logos, photographs, text, recipes, graphics, videos, and designs belongs to <strong>Yemnest</strong> and may not be copied or reproduced without written permission.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, our liability shall be limited to the purchase price of the product ordered.</p>
            <p>We are not liable for indirect, incidental, or consequential damages arising from the use of our website or products.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the website unlawfully</li>
              <li>Attempt unauthorized access</li>
              <li>Upload malicious software</li>
              <li>Misuse customer or company information</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Governing Law</h2>
            <p>These Terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts located in Hyderabad, Telangana.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Changes</h2>
            <p>We reserve the right to update these Terms and Conditions at any time.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Contact</h2>
            <p><strong>Yemnest</strong><br />
            Plot No 26/P, Phase 1,<br />
            Aparna Palm Grove,<br />
            Kompally, Hyderabad ,<br />
            Telangana - 500014</p>
            <p>yemnest@gmail.com<br />
            7337493643</p>
          </div>
        </div>
      </div>
    </main>
  );
}
