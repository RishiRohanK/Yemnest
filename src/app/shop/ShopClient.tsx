"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

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
  image2?: string;
  image3?: string;
  image4?: string;
  dietary?: string;
}

const CATEGORIES = ["All", "Kunafa Bars", "Gift Boxes", "Atelier Specialties"];

const ProductCard = memo(({ product, onAddToCart, priority }: { product: Product, onAddToCart: (p: Product) => void, priority: boolean }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false); // Can add actual wishlist logic later
  
  return (
    <div className="group relative flex flex-col h-full bg-transparent bg-[url('/chocolate-border-new2.jpg')] bg-[length:100%_100%] bg-no-repeat transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-xl">
      {/* Inner wrapper to keep content inside the organic cream area of the image */}
      <div className="relative flex flex-col flex-1 pt-[12%] px-[8%] pb-[20%] bg-transparent">
        
        {/* Badges */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-2">
          {product.stockCount <= 5 && product.stockCount > 0 && (
            <span className="bg-[#724D26] text-white text-[9px] uppercase tracking-wider px-2 py-1 shadow-sm rounded-sm">Low Stock</span>
          )}
          {(product.cutoffPrice ?? 0) > product.price && (
            <span className="bg-[#106636] text-white text-[9px] uppercase tracking-wider px-2 py-1 shadow-sm rounded-sm">Sale</span>
          )}
        </div>

        {/* Wishlist Icon */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-2 right-2 z-20 transition-colors bg-white/90 p-1.5 rounded-full shadow-md opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 duration-300 ${isWishlisted ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}
        >
          <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-50 mb-4 rounded-3xl shadow-sm border border-zinc-200/40">
          <Link href={`/shop/${product.id}`} className="relative block w-full h-full">
            {/* Primary Image */}
            <Image
              src={product.image1}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-opacity duration-500 z-10 group-hover:opacity-0"
            />
            {/* Hover Image (Fallback to image1 if image2 is missing) */}
            <Image
              src={product.image2 || product.image1}
              alt={product.name + " hover"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 scale-105 group-hover:scale-100 z-0"
            />
          </Link>
        </div>

        {/* Details */}
        <div className="px-4 pb-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-semibold text-[#8A6F54] uppercase tracking-widest">{product.category}</span>
            <div className="flex text-yellow-500 text-[10px]">
              ★ 4.8
            </div>
          </div>
          
          <Link href={`/shop/${product.id}`} className="group-hover:text-[#106636] transition-colors">
            <h3 className="text-base font-bold text-zinc-900 leading-snug">{product.name}</h3>
          </Link>
          
          <p className="text-xs text-[#724D26] font-medium mt-1 mb-3 line-clamp-1">{product.subLine}</p>
          
          <div className="mt-auto flex items-end justify-between pt-3 border-t border-zinc-100/50">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#106636]">₹{product.price.toFixed(2)}</span>
              {(product.cutoffPrice ?? 0) > product.price && (
                <span className="text-sm text-[#8A6F54] line-through font-medium">₹{product.cutoffPrice!.toFixed(2)}</span>
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product);
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 2000);
              }}
              disabled={product.stockCount === 0}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isAdded ? "bg-[#106636] text-white" : "bg-zinc-100 hover:bg-[#106636] text-zinc-900 hover:text-white"}`}
            >
              {isAdded ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
ProductCard.displayName = "ProductCard";

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);
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

  const handleAddToCart = useCallback((product: Product) => {
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
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subLine.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

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
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  priority={index < 3}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
