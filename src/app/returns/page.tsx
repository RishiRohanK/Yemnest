export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-zinc-200 shadow-sm">
        <h1 className="text-3xl font-light text-zinc-900 mb-2 tracking-wide">Refund, Cancellation & Replacement Policy</h1>
        <p className="text-sm text-zinc-500 mb-8">Effective Date: 02-08-2026</p>
        
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>At <strong>Yemnest</strong>, every order is freshly prepared and handled with care. Due to the perishable nature of our products, our refund policy is as follows.</p>
          
          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Order Cancellation</h2>
            <p>Once production or dispatch has begun, cancellations cannot be accepted.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Refund Eligibility</h2>
            <p>Refunds may be approved if:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Wrong product was delivered</li>
              <li>Product arrived damaged due to delivery</li>
              <li>Product was missing from the order</li>
              <li>Order could not be delivered due to our fault</li>
              <li>Order was cancelled by us</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Non-Refundable Situations</h2>
            <p>Refunds will not be provided for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Change of mind after preparation</li>
              <li>Incorrect delivery address provided by the customer</li>
              <li>Recipient unavailable during delivery</li>
              <li>Minor variations in appearance or decoration</li>
              <li>Improper storage after delivery</li>
              <li>Personal taste preferences</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Damaged or Incorrect Orders</h2>
            <p>If you receive a damaged or incorrect order:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Notify us within <strong>2 hours</strong> of delivery.</li>
              <li>Share clear photographs of the package and product.</li>
              <li>Include your order number.</li>
            </ul>
            <p className="mt-4">After verification, we may offer:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Replacement</li>
              <li>Store credit</li>
              <li>Full or partial refund, depending on the situation</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Refund Processing</h2>
            <p>Approved refunds will be processed to the original payment method within <strong>5–7 business days</strong>, depending on your bank or payment provider.</p>
          </div>

          <div>
            <h2 className="text-xl text-[#724D26] mt-8 mb-4 font-medium">Contact Us</h2>
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
