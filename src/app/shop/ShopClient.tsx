"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";

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

const RakshaSlideshow = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);
  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((img, i) => (
        <Image
          key={img}
          src={img}
          alt="Product"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
};

const ProductCard = memo(({ product, onAddToCart, priority, isWishlisted, onToggleWishlist }: { product: Product, onAddToCart: (p: Product) => void, priority: boolean, isWishlisted: boolean, onToggleWishlist: (p: Product) => void }) => {
  const [isAdded, setIsAdded] = useState(false);
  
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
            onToggleWishlist(product);
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
            {product.name.toLowerCase().includes('raksha bandhan') ? (
              <RakshaSlideshow images={['/images/themes/raksha-bandhan/closed.jpg', '/images/themes/raksha-bandhan/open.jpg']} />
            ) : product.name.toLowerCase().includes('birthday') ? (
              <RakshaSlideshow images={['/images/themes/birthday/closed.jpg', '/images/themes/birthday/open.jpg']} />
            ) : product.name.toLowerCase().includes('anniversary') ? (
              <RakshaSlideshow images={['/images/themes/anniversary/closed.jpg', '/images/themes/anniversary/open.jpg']} />
            ) : product.name.toLowerCase().includes('diwali') ? (
              <RakshaSlideshow images={['/images/themes/diwali/closed.jpg', '/images/themes/diwali/open.jpg']} />
            ) : (
              <>
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
              </>
            )}
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
            <h3 className={`text-base leading-snug ${
              product.name.toLowerCase().includes('raksha bandhan') 
                ? 'font-serif text-[#8B0000] italic font-bold' 
                : 'font-bold text-zinc-900'
            }`}>
              {product.name}
            </h3>
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
              className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-colors ${isAdded ? "bg-[#106636] text-white" : "bg-zinc-100 hover:bg-[#106636] text-zinc-900 hover:text-white"}`}
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Fetch user session
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<Product[]>([]);

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

  // Listen to wishlist updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      const syncWishlist = () => {
        try {
          const stored = localStorage.getItem("yemnest_wishlist");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              if (parsed.length > 0 && typeof parsed[0] === 'string') {
                setWishlist([]);
                localStorage.removeItem("yemnest_wishlist");
              } else {
                setWishlist(parsed);
              }
            } else {
              setWishlist([]);
            }
          } else {
            setWishlist([]);
          }
        } catch (e) {
          console.error("Failed to parse wishlist from local storage", e);
          setWishlist([]);
        }
      };
      syncWishlist();
      window.addEventListener("yemnest_wishlist_updated", syncWishlist);
      return () => window.removeEventListener("yemnest_wishlist_updated", syncWishlist);
    }
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    if (!user) {
      toast.error("Please sign in to add to wishlist", { icon: "🔒" });
      return;
    }

    let updated: Product[];
    if (wishlist.some(item => item.id === product.id)) {
      updated = wishlist.filter(item => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    
    if (typeof window !== "undefined") {
      const lightweightUpdated = updated.map(item => ({
        ...item,
        image1: "", image2: "", image3: "", image4: "", description: ""
      }));
      localStorage.setItem("yemnest_wishlist", JSON.stringify(lightweightUpdated));
      window.dispatchEvent(new Event("yemnest_wishlist_updated"));
    }
  }, [wishlist, user]);

  const handleAddToCart = useCallback((product: Product) => {
    if (!user) {
      toast.error("Please sign in to add to cart", { icon: "🔒" });
      return false;
    }

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
        if (items[existingIndex].quantity + 1 > product.stockCount) {
          toast.error(`You cannot add more. Only ${product.stockCount} in stock!`);
          return;
        }
        items[existingIndex].quantity += 1;
      } else {
        if (product.stockCount < 1) {
          toast.error("Out of stock!");
          return;
        }
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
      return true;
    }
    return false;
  }, [user]);

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
        {/* Catalog List */}
        <div className="mt-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#FEFEFD] border border-dashed border-zinc-300">
              <p className="text-sm text-zinc-400">No products found.</p>
              <p className="text-xs text-zinc-400 mt-1">Please create a product in the Admin Panel to display it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  priority={index < 3}
                  isWishlisted={wishlist.some(w => w.id === product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Filters Trigger Button */}
      <div 
        onMouseEnter={() => setIsSidebarOpen(true)}
        className="fixed right-0 top-1/3 z-[90] bg-[#232F3E] text-white py-3 px-2.5 rounded-l shadow-xl cursor-pointer flex flex-col items-center gap-2 hover:bg-[#106636] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </div>

      {/* Drawer Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[100] transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Right Sidebar Filters Drawer */}
      <aside 
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-[110] shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="bg-[#232F3E] text-white p-5 flex items-center gap-3 sticky top-0 z-10">
          <div className="bg-white/20 p-2 rounded-full">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-wide">
            Filter Shop
          </span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto text-white/70 hover:text-white p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col py-4">
          {/* Categories */}
          <div className="border-b border-zinc-200 pb-4 mb-4">
            <h3 className="px-6 py-3 text-[16px] font-bold text-zinc-900">Shop by Category</h3>
            <div className="flex flex-col">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-6 py-3.5 text-sm transition-colors flex items-center justify-between group ${
                    selectedCategory === cat 
                    ? "text-[#106636] font-semibold bg-zinc-50" 
                    : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <span>{cat}</span>
                  <svg className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors ${selectedCategory === cat ? "text-[#106636]" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
