"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  subLine: string;
  category: string;
  price: number;
  cutoffPrice: number;
  description: string;
  stockCount: number;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(product.image1);
  const [cartToast, setCartToast] = useState(false);

  const handleAddToCart = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("yemnest_cart_items");
      let items: { product: Product; quantity: number }[] = [];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            items = parsed.filter((item: any) => item && item.product && typeof item.product.id === "string");
          }
        } catch (e) {
          items = [];
        }
      }

      const existingIndex = items.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        items[existingIndex].quantity += 1;
      } else {
        items.push({ product, quantity: 1 });
      }

      // Strip huge fields (like base64 images) to prevent QuotaExceededError in localStorage
      const lightweightItems = items.map(item => ({
        ...item,
        product: {
          ...item.product,
          image1: "",
          image2: "",
          image3: "",
          image4: "",
          description: ""
        }
      }));

      try {
        localStorage.setItem("yemnest_cart_items", JSON.stringify(lightweightItems));
      } catch (err) {
        console.error("Failed to save cart to localStorage:", err);
      }

      // Calculate total count
      const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      localStorage.setItem("yemnest_cart_count", totalCount.toString());

      // Dispatch global update event & open cart drawer
      window.dispatchEvent(new Event("yemnest_cart_updated"));
      window.dispatchEvent(new Event("yemnest_open_cart"));
    }

    setCartToast(true);
    setTimeout(() => {
      setCartToast(false);
    }, 3000);
  };

  const thumbnails = [product.image1, product.image2, product.image3, product.image4].filter(Boolean);

  return (
    <div className="flex-1 bg-[#FAF9F6] text-zinc-900 font-sans min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          onClick={() => router.push("/shop")}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-[#106636] transition-colors mb-8 uppercase tracking-wider"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Shop
        </button>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left Column: Image Viewer */}
          <div className="space-y-4">
            <div className="aspect-[4/3] w-full bg-[#FEFEFD] border border-zinc-200/60 overflow-hidden relative shadow-sm">
              <img
                src={activeImage}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover select-none"
              />
            </div>

            {/* Thumbnails row */}
            <div className="grid grid-cols-4 gap-2">
              {thumbnails.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`aspect-[4/3] w-full border overflow-hidden relative bg-[#FEFEFD] transition-all rounded-none ${
                    activeImage === imgUrl
                      ? "border-[#106636] ring-1 ring-[#106636]"
                      : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="bg-[#FEFEFD] border border-zinc-200/60 p-8 shadow-sm space-y-6">
            <div>
              <span className="text-[#106636] text-[10px] font-semibold uppercase tracking-widest block mb-2">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-zinc-900 mb-1">
                {product.name}
              </h1>
              <p className="text-xs text-[#724D26] font-medium">
                {product.subLine}
              </p>
            </div>

            {/* Pricing block */}
            <div className="border-t border-b border-zinc-100 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-[#724D26]">₹{product.price.toFixed(2)}</span>
                  {product.cutoffPrice > product.price && (
                    <span className="text-sm text-zinc-400 line-through">₹{product.cutoffPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>

              {/* Stock count */}
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Availability</span>
                {product.stockCount > 0 ? (
                  <span className="text-xs font-semibold text-green-700">
                    In Stock ({product.stockCount} items remaining)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-650">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-widest text-[#724D26] font-semibold">
                Product Description
              </h3>
              <p className="text-xs text-zinc-650 leading-relaxed font-normal whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-zinc-100">
              {product.stockCount > 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-[#106636] hover:bg-[#0c4f29] text-white text-xs uppercase tracking-wider font-semibold rounded-none transition-colors"
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-4 bg-zinc-100 text-zinc-400 text-xs uppercase tracking-wider font-semibold rounded-none cursor-not-allowed border border-zinc-200"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Toast Alert */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FEFEFD] border border-zinc-200 shadow-xl px-5 py-4 flex items-center justify-between gap-4 animate-fade-in rounded-none min-w-[280px]">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-green-600 rounded-none" />
            <div>
              <p className="text-xs font-normal text-zinc-500 uppercase tracking-widest">Added to cart</p>
              <p className="text-xs font-medium text-zinc-900 mt-0.5">{product.name}</p>
            </div>
          </div>
          <button
            onClick={() => setCartToast(false)}
            className="text-zinc-400 hover:text-zinc-600 p-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
