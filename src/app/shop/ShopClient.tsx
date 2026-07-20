"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

const CATEGORIES = ["All", "Kunafa Bars", "Gift Boxes", "Atelier Specialties"];

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);

  // Listen to cart updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCartCount(parseInt(localStorage.getItem("yemnest_cart_count") || "0", 10));
      const handleCartUpdate = () => {
        setCartCount(parseInt(localStorage.getItem("yemnest_cart_count") || "0", 10));
      };
      window.addEventListener("yemnest_cart_updated", handleCartUpdate);
      return () => window.removeEventListener("yemnest_cart_updated", handleCartUpdate);
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("yemnest_cart_items");
      let items: { product: Product; quantity: number }[] = [];
      if (stored) {
        try {
          items = JSON.parse(stored);
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

      localStorage.setItem("yemnest_cart_items", JSON.stringify(items));

      // Calculate total count
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("yemnest_cart_count", totalCount.toString());

      // Dispatch global update event
      window.dispatchEvent(new Event("yemnest_cart_updated"));
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subLine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 bg-[#FAF9F6] text-zinc-900 font-sans min-h-screen pb-24 relative">
      {/* Header Banner */}
      <header className="relative py-12 bg-zinc-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-[#F5E6C4] text-xs uppercase tracking-widest block mb-2">Shop</span>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight">Our Chocolates</h1>
          <p className="text-xs text-zinc-400 mt-2">Browse and buy our selection.</p>
        </div>
      </header>

      {/* Main shop screen */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Controls Layout */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chocolates..."
              className="bg-[#FEFEFD] border border-zinc-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[#106636] rounded-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors duration-200 rounded-none border ${
                    selectedCategory === category
                      ? "bg-[#106636] text-white border-[#106636]"
                      : "bg-[#FEFEFD] text-zinc-600 hover:text-zinc-900 border-zinc-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              onClick={() => window.dispatchEvent(new Event("yemnest_open_cart"))}
              className="px-4 py-2 text-xs border border-zinc-300 bg-[#FEFEFD] text-zinc-800 uppercase tracking-wider rounded-none hover:bg-zinc-50 relative"
            >
              Open Cart ({cartCount})
            </button>
          </div>
        </div>

        {/* Catalog List */}
        <div className="mt-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#FEFEFD] border border-dashed border-zinc-300">
              <p className="text-sm text-zinc-400">No products found.</p>
              <p className="text-xs text-zinc-400 mt-1">Please create a product in the Admin Panel to display it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#FEFEFD] border border-zinc-100 flex flex-col justify-between p-5 rounded-none shadow-sm group hover:shadow-md transition-shadow duration-200"
                >
                  {/* Clickable Card Body Area */}
                  <Link
                    href={`/shop/${product.id}`}
                    className="cursor-pointer flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image container */}
                      <div className="w-full h-48 overflow-hidden bg-zinc-50 mb-4 relative">
                        <img
                          src={product.image1}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101 select-none"
                        />
                      </div>
                      
                      {/* Title & SubLine (Sentence case) */}
                      <h3 className="text-base font-medium text-zinc-800 mb-0.5 group-hover:text-[#106636] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-[#724D26] mb-2 font-normal">
                        {product.subLine}
                      </p>
                      <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{product.description}</p>
                    </div>

                    {/* Price highlighted layout */}
                    <div className="flex justify-between items-center mb-4 mt-auto">
                      <span className="text-xs text-zinc-400">Price</span>
                      <div className="flex items-center gap-2">
                        {product.cutoffPrice > product.price && (
                          <span className="text-xs text-zinc-400 line-through">₹{product.cutoffPrice.toFixed(2)}</span>
                        )}
                        <span className="text-sm font-semibold text-[#106636]">₹{product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Add to Cart button outside clickable details container */}
                  <div>
                    {product.stockCount > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-full py-2.5 bg-zinc-900 text-white text-xs font-normal rounded-none hover:bg-[#106636] transition-colors duration-200"
                      >
                        Add to cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 bg-zinc-100 text-zinc-400 text-xs font-normal rounded-none cursor-not-allowed border border-zinc-200"
                      >
                        Out of stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
