import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "My Orders | Yemnest Chocolates",
  description: "View your Yemnest Chocolates order history.",
};

export default function OrdersPage() {
  return (
    <>
      <OrdersClient />
    </>
  );
}
