"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Product {
  id: string;
  name: string;
  subLine: string;
  category: string;
  price: number;
  cutoffPrice?: number;
  description: string;
  stockCount: number;
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
}

export default function CollectionsClient({ initialProducts }: { initialProducts: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // State for Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [showInStock, setShowInStock] = useState(false);

  // State for Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewImage, setQuickViewImage] = useState<string>("");
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);
  const [cartToast, setCartToast] = useState(false);
  const [cartToastName, setCartToastName] = useState("");

  const CATEGORIES = ["All", "Atelier Specialties", "Kunafa Bars", "Gift Boxes", "Limited Edition"];
  
  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subLine.toLowerCase().includes(q)
      );
    }
    if (showInStock) {
      result = result.filter((p) => p.stockCount > 0);
    }
    result = result.filter((p) => p.price <= priceRange);

    // Sorting
    switch (sortBy) {
      case "Price Low to High":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price High to Low":
        result.sort((a, b) => b.price - a.price);
        break;
      // Mock 'Best Selling' by sorting by stock count ascending (assuming lower stock = sold more)
      case "Best Selling":
        result.sort((a, b) => a.stockCount - b.stockCount);
        break;
      case "Newest":
      default:
        // Already sorted by newest from DB
        break;
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery, showInStock, priceRange, sortBy]);

  useGSAP(() => {
    // 1. Hero Animations
    gsap.fromTo(
      ".hero-el",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }
    );

    gsap.to(".hero-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // 2. Product Stagger Reveal
    const productCards = gsap.utils.toArray<HTMLElement>(".product-card-reveal");
    if (productCards.length > 0) {
      gsap.fromTo(
        productCards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".products-grid",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // 3. Promotional Banner Reveal
    const banners = gsap.utils.toArray<HTMLElement>(".promo-banner");
    banners.forEach((banner) => {
      gsap.fromTo(
        banner,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: banner,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

  }, { scope: containerRef, dependencies: [filteredProducts] });

  // Handle Cart
  const handleAddToCart = (product: Product, quantity: number = 1) => {
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
        items[existingIndex].quantity += quantity;
      } else {
        items.push({ product, quantity });
      }

      // Strip fields to save localStorage space
      const lightweightItems = items.map(item => ({
        ...item,
        product: {
          ...item.product,
          image1: "", image2: "", image3: "", image4: "", description: ""
        }
      }));

      try {
        localStorage.setItem("yemnest_cart_items", JSON.stringify(lightweightItems));
      } catch (err) {
        console.error("Failed to save cart to localStorage:", err);
      }

      const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      localStorage.setItem("yemnest_cart_count", totalCount.toString());

      window.dispatchEvent(new Event("yemnest_cart_updated"));
      
      setQuickViewProduct(null); // Close modal
      setCartToastName(product.name);
      setCartToast(true);
      setTimeout(() => setCartToast(false), 3000);
      
      // Optionally open global cart drawer
      // window.dispatchEvent(new Event("yemnest_open_cart"));
    }
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewImage(product.image1);
    setQuickViewQuantity(1);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans">
      
      {/* Premium Collections Hero */}
      <section className="hero-section relative h-[55vh] md:h-[65vh] flex flex-col justify-center items-center text-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ik.imagekit.io/dypkhqxip/banner1.1%20(6).png"
            alt="Yemnest Luxury Collections"
            fill
            priority
            className="hero-bg object-cover opacity-50 select-none"
          />
        </div>
        <div className="relative z-10 px-4 max-w-3xl mx-auto">
          <span className="hero-el block text-[#F5E6C4] text-[10px] font-semibold tracking-[0.3em] uppercase mb-4">
            Exclusive Selection
          </span>
          <h1 className="hero-el text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-6 leading-tight">
            The Art of Chocolate
          </h1>
          <p className="hero-el text-sm md:text-base text-zinc-300 font-normal leading-relaxed mb-8">
            Explore our curated gallery of premium artisanal creations. Each piece is a harmonious blend of sustainable luxury, pure cocoa butter, and visionary craftsmanship.
          </p>
          <div className="hero-el">
            <a href="#filters" className="inline-block bg-[#F5E6C4] text-[#106636] text-[10px] uppercase tracking-widest py-3 px-8 hover:bg-white transition-colors shadow-lg">
              Explore Collection
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div id="filters" className="sticky top-0 z-40 bg-[#FEFEFD] border-b border-zinc-200/80 shadow-sm px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Categories & Search */}
          <div className="flex flex-1 items-center gap-4 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            <div className="flex items-center gap-2 pr-4 border-r border-zinc-200">
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-32 lg:w-48 bg-transparent text-xs outline-none text-zinc-800 placeholder-zinc-400"
              />
            </div>
            <div className="flex gap-2 whitespace-nowrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors border ${
                    selectedCategory === cat 
                    ? "bg-[#106636] text-white border-[#106636]" 
                    : "bg-transparent text-zinc-600 border-transparent hover:border-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side Filters */}
          <div className="flex items-center gap-6 text-xs text-zinc-600">
            {/* Price Slider */}
            <div className="hidden sm:flex items-center gap-2">
              <span>Up to ₹{priceRange}</span>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="100"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-24 accent-[#106636]"
              />
            </div>
            
            {/* Availability Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showInStock}
                onChange={(e) => setShowInStock(e.target.checked)}
                className="accent-[#106636]"
              />
              In Stock Only
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span>Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-zinc-900 font-medium"
              >
                <option>Newest</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
                <option>Best Selling</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-white border border-dashed border-zinc-200">
            <svg className="w-12 h-12 text-zinc-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg text-zinc-900 font-normal mb-2">No masterpieces found</h3>
            <p className="text-sm text-zinc-500">Try adjusting your filters or searching for something else.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setPriceRange(5000);
                setShowInStock(false);
              }}
              className="mt-6 border-b border-[#106636] text-[#106636] text-xs uppercase tracking-widest pb-1"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((product, idx) => (
              <div key={product.id} className="relative">
                {/* Interspersed Banner every 8 products */}
                {idx === 4 && (
                  <div className="promo-banner col-span-full mb-12 mt-4 relative h-[30vh] sm:h-[40vh] flex items-center justify-center overflow-hidden group cursor-pointer bg-zinc-900">
                    <Image src="https://ik.imagekit.io/dypkhqxip/collectiosn2?updatedAt=1784063410170" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="Promo" />
                    <div className="relative z-10 text-center">
                      <span className="text-[#F5E6C4] text-[10px] uppercase tracking-[0.3em] block mb-2">Exclusive Release</span>
                      <h3 className="text-3xl text-white font-light tracking-wide mb-4">The Festive Gift Box</h3>
                      <Link href="/shop" className="bg-white text-black px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-[#F5E6C4] transition-colors">Discover Now</Link>
                    </div>
                  </div>
                )}

                <div className="product-card-reveal group relative flex flex-col h-full bg-[#FEFEFD] border border-transparent hover:border-zinc-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                    {product.stockCount <= 5 && product.stockCount > 0 && (
                      <span className="bg-[#724D26] text-white text-[9px] uppercase tracking-wider px-2 py-1 shadow-sm">Low Stock</span>
                    )}
                    {(product.cutoffPrice ?? 0) > product.price && (
                      <span className="bg-[#106636] text-white text-[9px] uppercase tracking-wider px-2 py-1 shadow-sm">Sale</span>
                    )}
                  </div>
                  
                  {/* Wishlist Icon */}
                  <button className="absolute top-3 right-3 z-20 text-zinc-400 hover:text-red-500 transition-colors bg-white/80 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-50 mb-4">
                    <Link href={`/shop/${product.id}`}>
                      {/* Primary Image */}
                      <Image
                        src={product.image1}
                        alt={product.name}
                        fill
                        className="object-cover transition-opacity duration-500 z-10 group-hover:opacity-0"
                      />
                      {/* Hover Image (Fallback to image1 if image2 is missing) */}
                      <Image
                        src={product.image2 || product.image1}
                        alt={product.name + " hover"}
                        fill
                        className="object-cover transition-transform duration-700 scale-105 group-hover:scale-100 z-0"
                      />
                    </Link>

                    {/* Quick View Button */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button 
                        onClick={() => openQuickView(product)}
                        className="w-full bg-white/90 backdrop-blur-sm text-zinc-900 py-2.5 text-[10px] uppercase tracking-widest font-semibold hover:bg-[#106636] hover:text-white transition-colors border border-zinc-200"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-4 pb-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-widest">{product.category}</span>
                      <div className="flex text-yellow-500 text-[10px]">
                        ★ 4.8
                      </div>
                    </div>
                    
                    <Link href={`/shop/${product.id}`} className="group-hover:text-[#106636] transition-colors">
                      <h3 className="text-base font-normal text-zinc-900 leading-snug">{product.name}</h3>
                    </Link>
                    
                    <p className="text-xs text-[#724D26] font-medium mt-1 mb-3 line-clamp-1">{product.subLine}</p>
                    
                    <div className="mt-auto flex items-end justify-between pt-3 border-t border-zinc-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#106636]">₹{product.price.toFixed(2)}</span>
                        {(product.cutoffPrice ?? 0) > product.price && (
                          <span className="text-xs text-zinc-400 line-through">₹{product.cutoffPrice!.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
          <div className="relative bg-[#FEFEFD] w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl animate-fade-in">
            
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-black bg-white/50 p-2 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Gallery */}
            <div className="w-full md:w-1/2 p-6 md:p-8 bg-zinc-50 flex flex-col">
              <div className="relative aspect-square w-full mb-4 bg-white border border-zinc-200">
                <Image src={quickViewImage} alt={quickViewProduct.name} fill className="object-cover" />
              </div>
              <div className="flex gap-2">
                {[quickViewProduct.image1, quickViewProduct.image2, quickViewProduct.image3, quickViewProduct.image4].filter(Boolean).map((img, i) => (
                  <button key={i} onClick={() => setQuickViewImage(img!)} className={`relative w-16 h-16 border ${quickViewImage === img ? 'border-[#106636]' : 'border-zinc-200'}`}>
                    <Image src={img!} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
              <span className="text-[#106636] text-[10px] uppercase tracking-widest mb-2 block">{quickViewProduct.category}</span>
              <h2 className="text-2xl font-light text-zinc-900 mb-1">{quickViewProduct.name}</h2>
              <div className="flex items-center gap-3 mb-4 border-b border-zinc-100 pb-4">
                <span className="text-xl font-medium text-[#724D26]">₹{quickViewProduct.price.toFixed(2)}</span>
                {(quickViewProduct.cutoffPrice ?? 0) > quickViewProduct.price && (
                  <span className="text-sm text-zinc-400 line-through">₹{quickViewProduct.cutoffPrice!.toFixed(2)}</span>
                )}
              </div>
              
              <p className="text-sm text-zinc-600 mb-6 leading-relaxed line-clamp-3">
                {quickViewProduct.description}
              </p>

              {/* Mock Premium Data */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <svg className="w-4 h-4 text-[#724D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span><strong>Ingredients:</strong> 100% Pure Cocoa Butter, Organic Cacao Beans, Unrefined Cane Sugar, Madagascar Vanilla.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <svg className="w-4 h-4 text-[#724D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span><strong>Net Weight:</strong> 150g (5.3 oz)</span>
                </div>
              </div>

              {/* Add to Cart Controls */}
              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border border-zinc-300">
                    <button onClick={() => setQuickViewQuantity(Math.max(1, quickViewQuantity - 1))} className="px-3 py-2 text-zinc-500 hover:text-black">-</button>
                    <span className="w-8 text-center text-sm font-medium">{quickViewQuantity}</span>
                    <button onClick={() => setQuickViewQuantity(quickViewQuantity + 1)} className="px-3 py-2 text-zinc-500 hover:text-black">+</button>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {quickViewProduct.stockCount > 0 ? `${quickViewProduct.stockCount} available` : "Out of stock"}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAddToCart(quickViewProduct, quickViewQuantity)}
                    disabled={quickViewProduct.stockCount === 0}
                    className="flex-1 bg-[#106636] hover:bg-zinc-900 text-white text-xs uppercase tracking-widest py-3.5 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                  <Link 
                    href={`/shop/${quickViewProduct.id}`}
                    className="flex-none px-6 py-3.5 border border-zinc-300 text-xs uppercase tracking-widest hover:border-black transition-colors text-center"
                  >
                    Full Details
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Cart Toast Notification */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#FEFEFD] border border-zinc-200 shadow-2xl px-5 py-4 flex items-center justify-between gap-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-[#106636] rounded-full" />
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">Added to cart</p>
              <p className="text-sm font-medium text-zinc-900">{cartToastName}</p>
            </div>
          </div>
          <button onClick={() => setCartToast(false)} className="text-zinc-400 hover:text-zinc-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
}
