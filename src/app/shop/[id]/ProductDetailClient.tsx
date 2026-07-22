"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [activeImage, setActiveImage] = useState(product.image1);
  const [quantity, setQuantity] = useState(1);
  const [cartToast, setCartToast] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const thumbnails = [product.image1, product.image2, product.image3, product.image4].filter((img): img is string => Boolean(img));

  useGSAP(() => {
    gsap.fromTo(
      ".reveal-el",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef });

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
        items[existingIndex].quantity += quantity;
      } else {
        items.push({ product, quantity });
      }

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
      // window.dispatchEvent(new Event("yemnest_open_cart"));
    }

    setCartToast(true);
    setTimeout(() => setCartToast(false), 3000);
  };

  return (
    <div ref={containerRef} className="flex-1 bg-[#FAF9F6] text-zinc-900 font-sans min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="reveal-el flex items-center gap-2 text-[10px] text-zinc-500 hover:text-[#106636] transition-colors mb-12 uppercase tracking-widest">
          <Link href="/collections" className="hover:text-black transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-zinc-800">{product.category}</span>
          <span>/</span>
          <span className="text-zinc-400">{product.name}</span>
        </div>

        {/* Product Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-24">
          
          {/* Image Gallery */}
          <div className="reveal-el space-y-6 sticky top-24">
            <div className="group relative aspect-square w-full bg-[#FEFEFD] border border-zinc-200 overflow-hidden shadow-sm cursor-crosshair">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-150 origin-center"
              />
            </div>
            
            {thumbnails.length > 1 && (
              <div className="flex gap-4">
                {thumbnails.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-20 border overflow-hidden bg-[#FEFEFD] transition-all rounded-none ${
                      activeImage === imgUrl ? "border-[#106636] ring-1 ring-[#106636]" : "border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    <Image src={imgUrl} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="reveal-el flex flex-col pt-4">
            <span className="text-[#724D26] text-[10px] font-semibold uppercase tracking-widest block mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-zinc-900 mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-zinc-500 font-medium mb-6">
              {product.subLine}
            </p>

            <div className="flex items-center gap-4 text-xs mb-8 pb-8 border-b border-zinc-200">
              <div className="flex text-[#106636]">
                ★★★★★
              </div>
              <span className="text-zinc-500 border-l border-zinc-300 pl-4">128 Reviews</span>
              <span className="text-zinc-500 border-l border-zinc-300 pl-4 text-[10px] uppercase tracking-widest">
                Artisanal Quality
              </span>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-3xl font-normal text-[#106636]">₹{product.price.toFixed(2)}</span>
              {(product.cutoffPrice ?? 0) > product.price && (
                <span className="text-lg text-zinc-400 line-through mb-1">₹{product.cutoffPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed font-normal mb-8">
              {product.description}
            </p>

            {/* Premium Details List */}
            <ul className="space-y-3 mb-10 text-xs text-zinc-500 font-normal">
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#724D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                100% Pure Cocoa Butter
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#724D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Freshly tempered upon order
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#724D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                Sustainably sourced micro-lots
              </li>
            </ul>

            {/* Add to Cart Actions */}
            <div className="bg-[#FEFEFD] p-6 border border-zinc-200 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Quantity</span>
                <span className={`text-[10px] uppercase tracking-widest ${product.stockCount > 0 ? "text-green-700" : "text-red-600"}`}>
                  {product.stockCount > 0 ? `In Stock (${product.stockCount})` : "Out of Stock"}
                </span>
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center border border-zinc-300 bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-zinc-500 hover:text-black transition-colors">-</button>
                  <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-zinc-500 hover:text-black transition-colors">+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stockCount === 0}
                  className="flex-1 bg-[#106636] hover:bg-zinc-900 text-white text-xs uppercase tracking-widest transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-zinc-400">
              <button className="flex items-center gap-2 hover:text-zinc-900 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Add to Wishlist
              </button>
              <span className="text-zinc-200">|</span>
              <button className="flex items-center gap-2 hover:text-zinc-900 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Premium Information Tabs */}
        <div className="reveal-el max-w-4xl mx-auto border-t border-zinc-200 pt-16 mb-24">
          <div className="flex justify-center gap-8 md:gap-16 border-b border-zinc-200 mb-10">
            {["description", "ingredients", "pairing"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs uppercase tracking-widest font-semibold transition-colors ${
                  activeTab === tab ? "text-[#106636] border-b-2 border-[#106636]" : "text-zinc-400 hover:text-zinc-800"
                }`}
              >
                {tab === "description" ? "The Craft" : tab === "ingredients" ? "Purity & Profile" : "Tasting Notes"}
              </button>
            ))}
          </div>

          <div className="text-center min-h-[150px]">
            {activeTab === "description" && (
              <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl mx-auto animate-fade-in">
                {product.description}
                <br/><br/>
                Crafted in our specialized refining atelier, our master chocolatiers combine traditional tempering methods with contemporary flavor pairings.
              </p>
            )}
            {activeTab === "ingredients" && (
              <div className="text-sm text-zinc-600 leading-relaxed max-w-2xl mx-auto animate-fade-in text-left">
                <p className="mb-4"><strong>Ingredients:</strong> Cocoa Mass, 100% Pure Cocoa Butter, Unrefined Cane Sugar, Emulsifier (Sunflower Lecithin), Natural Vanilla Flavoring.</p>
                <p className="mb-4"><strong>Allergens:</strong> May contain traces of tree nuts, milk, and soy. Produced in a facility that handles dairy and nuts.</p>
                <p><strong>Net Weight:</strong> 150g (5.29 oz)</p>
              </div>
            )}
            {activeTab === "pairing" && (
              <div className="text-sm text-zinc-600 leading-relaxed max-w-2xl mx-auto animate-fade-in">
                <p className="mb-4">For the ultimate sensory experience, allow the chocolate to reach room temperature before tasting.</p>
                <p><strong>Suggested Pairing:</strong> A robust Espresso, an aged Tawny Port, or a light Earl Grey tea perfectly complements the rich botanical notes of this selection.</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section Mock */}
        <div className="reveal-el max-w-4xl mx-auto border-t border-zinc-200 pt-16 mb-24">
          <h2 className="text-2xl font-light text-zinc-900 text-center mb-12">Client Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-zinc-100 shadow-sm">
              <div className="text-[#106636] mb-3">★★★★★</div>
              <h4 className="text-sm font-semibold mb-2">Absolute Perfection</h4>
              <p className="text-xs text-zinc-500 italic mb-4">&quot;The depth of flavor is unparalleled. You can truly taste the quality of the cocoa butter. This is not just chocolate, it&apos;s an experience.&quot;</p>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">— Eleanor C.</span>
            </div>
            <div className="bg-white p-8 border border-zinc-100 shadow-sm">
              <div className="text-[#106636] mb-3">★★★★★</div>
              <h4 className="text-sm font-semibold mb-2">My Go-To Gift</h4>
              <p className="text-xs text-zinc-500 italic mb-4">&quot;I bought the Kunafa bar and it was mind-blowing. The packaging is luxurious and the crunch is perfect. Worth every penny.&quot;</p>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">— Julian R.</span>
            </div>
          </div>
        </div>

        {/* Related Pairings Banner */}
        <div className="reveal-el relative h-64 overflow-hidden flex items-center justify-center text-center bg-zinc-900 mt-12 group cursor-pointer">
          <Image src="https://ik.imagekit.io/dypkhqxip/collectiosn5" fill className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" alt="Discover More" />
          <div className="relative z-10 px-4">
            <span className="text-[#F5E6C4] text-[10px] uppercase tracking-[0.3em] block mb-2">Curated For You</span>
            <h3 className="text-2xl text-white font-light tracking-wide mb-6">Explore Related Masterpieces</h3>
            <Link href="/collections" className="inline-block border-b border-white pb-1 text-xs text-white uppercase tracking-widest hover:text-[#F5E6C4] hover:border-[#F5E6C4] transition-colors">
              Back to Collections
            </Link>
          </div>
        </div>

      </div>

      {/* Cart Toast Notification */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#FEFEFD] border border-zinc-200 shadow-2xl px-5 py-4 flex items-center justify-between gap-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-[#106636] rounded-full" />
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">Added to cart</p>
              <p className="text-sm font-medium text-zinc-900">{product.name} (x{quantity})</p>
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
