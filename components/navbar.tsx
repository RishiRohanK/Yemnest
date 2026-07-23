"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface UserState {
  name: string;
  id: string;
  email: string;
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
  image2: string;
  image3: string;
  image4: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserState | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);

  // Global Cart Drawer State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Global Wishlist Drawer State
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  
  // Toast state
  const [cartToast, setCartToast] = useState(false);
  const [cartToastName, setCartToastName] = useState("");
  const [addedWishlistIds, setAddedWishlistIds] = useState<string[]>([]);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Sync cart and auth states from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Sync cart items list
      const syncCartItems = () => {
        const storedItems = localStorage.getItem("yemnest_cart_items");
        if (storedItems) {
          try {
            const parsed = JSON.parse(storedItems);
            if (Array.isArray(parsed)) {
              const validItems = parsed.filter(
                (item: any) => item && item.product && typeof item.product.id === "string"
              );
              setCartItems(validItems);
            } else {
              setCartItems([]);
            }
          } catch (e) {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
        setCartCount(parseInt(localStorage.getItem("yemnest_cart_count") || "0", 10));
      };

      syncCartItems();

      // Listen for cart changes
      window.addEventListener("yemnest_cart_updated", syncCartItems);

      // Listen for open cart drawer command
      const handleOpenCartDrawer = () => {
        setIsCartOpen(true);
      };
      window.addEventListener("yemnest_open_cart", handleOpenCartDrawer);

      // Sync wishlist items list
      const syncWishlistItems = () => {
        const storedItems = localStorage.getItem("yemnest_wishlist");
        if (storedItems) {
          try {
            const parsed = JSON.parse(storedItems);
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] !== "string") {
              setWishlistItems(parsed);
            } else {
              setWishlistItems([]);
            }
          } catch (e) {
            setWishlistItems([]);
          }
        } else {
          setWishlistItems([]);
        }
      };

      syncWishlistItems();
      window.addEventListener("yemnest_wishlist_updated", syncWishlistItems);

      const handleOpenWishlistDrawer = () => {
        setIsWishlistOpen(true);
      };
      window.addEventListener("yemnest_open_wishlist", handleOpenWishlistDrawer);

      // Auth sync
      const loadUser = () => {
        const storedUser = localStorage.getItem("yemnest_user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      };

      loadUser();
      window.addEventListener("yemnest_auth_updated", loadUser);

      return () => {
        window.removeEventListener("yemnest_cart_updated", syncCartItems);
        window.removeEventListener("yemnest_open_cart", handleOpenCartDrawer);
        window.removeEventListener("yemnest_auth_updated", loadUser);
        window.removeEventListener("yemnest_wishlist_updated", syncWishlistItems);
        window.removeEventListener("yemnest_open_wishlist", handleOpenWishlistDrawer);
      };
    }
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateCartQuantity = useCallback((productId: string, increment: boolean) => {
    const updated = cartItems.map((item) => {
      if (item?.product?.id === productId) {
        const newQty = increment ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });

    const lightweightUpdated = updated.map(item => ({
      ...item,
      product: { ...item.product, image1: "", image2: "", image3: "", image4: "", description: "" }
    }));

    try {
      localStorage.setItem("yemnest_cart_items", JSON.stringify(lightweightUpdated));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
    const updatedCount = updated.reduce((sum, item) => sum + (item.quantity || 1), 0);
    localStorage.setItem("yemnest_cart_count", updatedCount.toString());
    window.dispatchEvent(new Event("yemnest_cart_updated"));
  }, [cartItems]);

  const handlePlaceOrder = () => {
    setCheckoutError("");
    if (!user) {
      setCheckoutError("Please sign in first to place an order.");
      setIsCartOpen(false);
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    setIsCartOpen(false);
    router.push("/checkout");
  };

  if (pathname && pathname.startsWith("/admin")) return null;

  const cartTotal = useMemo(() => cartItems.reduce(
    (sum, item) => sum + Number(item?.product?.price || 0) * Number(item?.quantity || 1),
    0
  ), [cartItems]);

  return (
    <nav className="relative sticky top-0 z-[100] w-full bg-[#FEFEFD] border-b border-zinc-200/60 shadow-sm rounded-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex flex-1 justify-start">
            <Link href="/" className="flex items-center gap-2 group rounded-none">
              <img
                src="https://ik.imagekit.io/dypkhqxip/yemnestnavbar"
                alt="Yemnest Logo"
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-none"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-10 flex-2">
            <Link
              href="/shop"
              className="text-sm font-normal tracking-wide text-zinc-800 hover:text-[#106636] transition-colors duration-200 rounded-none"
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className="text-sm font-normal tracking-wide text-zinc-800 hover:text-[#106636] transition-colors duration-200 rounded-none"
            >
              Collections
            </Link>
            <Link
              href="/story"
              className="text-sm font-normal tracking-wide text-zinc-800 hover:text-[#106636] transition-colors duration-200 rounded-none"
            >
              Our Story
            </Link>
            <Link
              href="/journey"
              className="text-sm font-normal tracking-wide text-zinc-800 hover:text-[#106636] transition-colors duration-200 rounded-none"
            >
              Cocoa Journey
            </Link>
          </div>

          {/* Desktop Right Utilities (Search, Profile, Cart) */}
          <div className="hidden md:flex flex-1 items-center justify-end space-x-6">
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-zinc-600 hover:text-[#106636] p-1.5 rounded-none hover:bg-zinc-100/50 transition-all duration-200"
              aria-label="Search store"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
                />
              </svg>
            </button>

            {/* Profile Dropdown Container */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  id="desktop-profile-button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 text-zinc-600 hover:text-[#106636] p-1.5 rounded-none hover:bg-zinc-100/50 transition-all duration-200 focus:outline-none"
                  aria-label="Profile menu"
                >
                  <svg
                    className="h-6 w-6 text-[#106636]"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="10" r="2.5" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17.5c0-1.8 2.5-3 5-3s5 1.2 5 3"
                    />
                  </svg>
                  <span className="text-xs font-normal text-zinc-700 hidden lg:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#FEFEFD] border border-zinc-200/80 shadow-lg py-2 z-50 rounded-none animate-fade-in overflow-hidden">
                    <div className="px-4 py-2 border-b border-zinc-100/80">
                      <p className="text-[10px] uppercase tracking-widest text-[#724D26] font-normal">
                        My Account
                      </p>
                      <p className="text-xs font-normal text-zinc-800 truncate">{user.name}</p>
                    </div>

                    <a
                      href="#profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-zinc-700 hover:bg-[#FAF9F6] hover:text-[#106636] transition-colors font-normal"
                    >
                      Profile
                    </a>
                    <a
                      href="#change-password"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-zinc-700 hover:bg-[#FAF9F6] hover:text-[#106636] transition-colors font-normal"
                    >
                      Change Password
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        window.dispatchEvent(new Event("yemnest_open_wishlist"));
                      }}
                      className="block w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-[#FAF9F6] hover:text-[#106636] transition-colors font-normal"
                    >
                      My Wishlist
                    </button>
                    <Link
                      href="/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-zinc-700 hover:bg-[#FAF9F6] hover:text-[#106636] transition-colors font-normal"
                    >
                      My Orders
                    </Link>

                    <div className="border-t border-zinc-100/80 mt-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          localStorage.removeItem("yemnest_user");
                          window.dispatchEvent(new Event("yemnest_auth_updated"));
                          window.location.href = "/";
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-[#FAF9F6] hover:text-[#106636] transition-colors font-normal"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className="text-zinc-600 hover:text-[#106636] p-1.5 rounded-none hover:bg-zinc-100/50 transition-all duration-200"
                aria-label="Your Account"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="10" r="2.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17.5c0-1.8 2.5-3 5-3s5 1.2 5 3"
                  />
                </svg>
              </Link>
            )}

            {/* Wishlist Icon */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              type="button"
              className="relative text-zinc-600 hover:text-red-500 p-1.5 rounded-none hover:bg-zinc-100/50 transition-all duration-200 focus:outline-none"
              aria-label="Wishlist"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-none bg-red-500 text-[9px] font-normal text-white">
                {wishlistItems.length}
              </span>
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              type="button"
              className="relative text-zinc-600 hover:text-[#106636] p-1.5 rounded-none hover:bg-zinc-100/50 transition-all duration-200 focus:outline-none"
              aria-label="Shopping Cart"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.7 3.032-7.1H5.882m0 0h14.736M7.5 17.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm12.75 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
              </svg>
              {/* Badge (Sharp cornered) */}
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-none bg-[#724D26] text-[9px] font-normal text-white">
                {cartCount}
              </span>
            </button>
          </div>

          {/* Mobile Right Actions & Hamburger Button */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Wishlist Badge directly on Mobile Header */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              type="button"
              className="relative text-zinc-650 hover:text-red-500 p-2 focus:outline-none"
              aria-label="Wishlist Mobile"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-none bg-red-500 text-[8px] font-normal text-white">
                {wishlistItems.length}
              </span>
            </button>

            {/* Real-time Cart Badge directly on Mobile Header */}
            <button
              onClick={() => setIsCartOpen(true)}
              type="button"
              className="relative text-zinc-650 hover:text-[#106636] p-2 focus:outline-none"
              aria-label="Shopping Cart Mobile"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.7 3.032-7.1H5.882m0 0h14.736M7.5 17.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm12.75 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
              </svg>
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-none bg-[#724D26] text-[8px] font-normal text-white">
                {cartCount}
              </span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-none text-zinc-700 hover:text-[#106636] hover:bg-zinc-100 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-down Search Bar */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-full bg-[#FEFEFD] border-b border-zinc-200 shadow-md py-4 px-4 sm:px-6 lg:px-8 z-30 transition-all duration-200 rounded-none">
          <div className="mx-auto max-w-3xl flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3 bg-zinc-100/80 rounded-none px-4 py-2 border border-zinc-200/80 focus-within:border-[#106636] transition-colors">
              <svg
                className="h-5 w-5 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none w-full text-zinc-800 text-sm font-normal placeholder-zinc-400 rounded-none"
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="text-zinc-500 hover:text-[#106636] p-2 hover:bg-zinc-100 rounded-none transition-colors"
              aria-label="Close search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/50 bg-[#FEFEFD] animate-fade-in rounded-none">
          <div className="space-y-1 px-4 pb-4 pt-3">
            <Link
              href="/shop"
              className="block rounded-none px-3 py-2 text-base font-normal tracking-wide text-zinc-800 hover:bg-zinc-100 hover:text-[#106636] transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className="block rounded-none px-3 py-2 text-base font-normal tracking-wide text-zinc-800 hover:bg-zinc-100 hover:text-[#106636] transition-colors"
            >
              Collections
            </Link>
            <Link
              href="/story"
              className="block rounded-none px-3 py-2 text-base font-normal tracking-wide text-zinc-800 hover:bg-zinc-100 hover:text-[#106636] transition-colors"
            >
              Our Story
            </Link>
            <Link
              href="/journey"
              className="block rounded-none px-3 py-2 text-base font-normal tracking-wide text-zinc-800 hover:bg-zinc-100 hover:text-[#106636] transition-colors"
            >
              Cocoa Journey
            </Link>

            {/* Mobile Actions divider */}
            <div className="border-t border-zinc-200/60 my-2 pt-2 flex flex-col gap-2 rounded-none">
              <div className="flex items-center justify-around">
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-zinc-600 hover:text-[#106636] px-3 py-2 rounded-none hover:bg-zinc-100"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
                  </svg>
                  <span className="text-sm font-normal">Search</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="flex items-center gap-2 text-zinc-600 hover:text-[#106636] px-3 py-2 rounded-none hover:bg-zinc-100 focus:outline-none"
                >
                  <div className="relative">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.7 3.032-7.1H5.882m0 0h14.736M7.5 17.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm12.75 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-none bg-[#724D26] text-[8px] font-normal text-white">
                      {cartCount}
                    </span>
                  </div>
                  <span className="text-sm font-normal">Cart</span>
                </button>
              </div>

              {/* Dynamic Account Option in Mobile Drawer */}
              <div className="border-t border-zinc-200/60 pt-2">
                {user ? (
                  <div className="w-full flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setIsMobileAccountOpen(!isMobileAccountOpen)}
                      className="w-full flex items-center justify-center gap-2 text-zinc-600 hover:text-[#106636] px-3 py-2 rounded-none hover:bg-zinc-100 focus:outline-none"
                    >
                      <svg className="h-5 w-5 text-[#106636]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="10" r="2.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17.5c0-1.8 2.5-3 5-3s5 1.2 5 3" />
                      </svg>
                      <span className="text-sm font-normal truncate max-w-[120px]">{user.name}</span>
                      <svg
                        className={`h-4 w-4 text-zinc-400 transition-transform ${isMobileAccountOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isMobileAccountOpen && (
                      <div className="w-full bg-zinc-50 border border-zinc-200/50 flex flex-col text-center items-center py-2 animate-fade-in space-y-2.5 mt-1 overflow-hidden">
                        <a
                          href="#profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full py-1 text-xs text-zinc-650 hover:text-[#106636] transition-colors"
                        >
                          Profile
                        </a>
                        <a
                          href="#change-password"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full py-1 text-xs text-zinc-650 hover:text-[#106636] transition-colors"
                        >
                          Change Password
                        </a>
                        <a
                          href="#wishlist"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full py-1 text-xs text-zinc-650 hover:text-[#106636] transition-colors"
                        >
                          My Wishlist
                        </a>
                        <a
                          href="#orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full py-1 text-xs text-zinc-650 hover:text-[#106636] transition-colors"
                        >
                          My Orders
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            localStorage.removeItem("yemnest_user");
                            window.dispatchEvent(new Event("yemnest_auth_updated"));
                            window.location.href = "/";
                          }}
                          className="block w-full py-1 text-xs text-zinc-600 hover:text-[#106636] transition-colors font-normal"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-zinc-600 hover:text-[#106636] px-3 py-2 rounded-none hover:bg-zinc-100"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="10" r="2.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17.5c0-1.8 2.5-3 5-3s5 1.2 5 3" />
                    </svg>
                    <span className="text-sm font-normal">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Slide-out Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 animate-fade-in flex justify-end">
          <div className="w-screen max-w-md bg-[#FEFEFD] border-l border-zinc-200 p-6 flex flex-col justify-between shadow-2xl animate-slide-in relative">
            
            {/* Drawer Header */}
            <div className="flex justify-between items-center border-b border-zinc-150 pb-4 mb-4">
              <h2 className="text-lg font-light uppercase tracking-wider text-zinc-800">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1.5 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {checkoutError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-none animate-fade-in">
                  {checkoutError}
                </div>
              )}

              {checkoutSuccess ? (
                <div className="py-12 text-center text-[#106636] bg-green-50 border border-green-200 animate-fade-in">
                  <p className="text-sm font-medium uppercase tracking-wider">Order Placed Successfully!</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Redirecting you to WhatsApp to complete checkout...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xs text-zinc-400">Your cart is empty.</p>
                  <Link
                    href="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs text-[#724D26] underline hover:text-[#5a3b1d] block mt-2"
                  >
                    Go back to Shop
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center border-b border-zinc-100 pb-3">
                      <div>
                        <p className="text-xs font-medium text-zinc-800">{item.product.name}</p>
                        <p className="text-[10px] text-zinc-400 mb-1">
                          Price: ₹{item.product.price.toFixed(2)}
                        </p>
                        
                        {/* Interactive Quantity controls */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, false)}
                            className="h-5 w-5 flex items-center justify-center border border-zinc-200 hover:border-zinc-400 bg-[#FAF9F6] text-zinc-700 text-xs font-normal transition-colors"
                          >
                            -
                          </button>
                          <span className="text-xs text-zinc-800 w-6 text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, true)}
                            className="h-5 w-5 flex items-center justify-center border border-zinc-200 hover:border-zinc-400 bg-[#FAF9F6] text-zinc-700 text-xs font-normal transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end justify-between self-stretch py-0.5">
                        <p className="text-xs font-semibold text-[#106636]">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = cartItems.filter((i) => i?.product?.id !== item?.product?.id);
                            
                            // Strip huge fields to prevent QuotaExceededError
                            const lightweightUpdated = updated.map(uItem => ({
                              ...uItem,
                              product: { ...uItem.product, image1: "", image2: "", image3: "", image4: "", description: "" }
                            }));

                            try {
                              localStorage.setItem("yemnest_cart_items", JSON.stringify(lightweightUpdated));
                            } catch (err) {
                              console.error("Failed to save cart to localStorage:", err);
                            }

                            const updatedCount = updated.reduce((sum, i) => sum + (i.quantity || 1), 0);
                            localStorage.setItem("yemnest_cart_count", updatedCount.toString());
                            window.dispatchEvent(new Event("yemnest_cart_updated"));
                          }}
                          className="text-[9px] text-red-500 hover:text-red-700 underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Checkout Footer */}
            {!checkoutSuccess && cartItems.length > 0 && (
              <div className="border-t border-zinc-200 pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Total Price</span>
                  <span className="font-semibold text-[#724D26] text-base">₹{cartTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 bg-[#106636] hover:bg-[#0c4f29] text-white text-xs uppercase tracking-wider font-semibold rounded-none transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

          </div>
        </div>
      )}
      {/* Global Slide-out Wishlist Drawer */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 animate-fade-in flex justify-end">
          <div className="w-screen max-w-md bg-[#FEFEFD] border-l border-zinc-200 p-6 flex flex-col justify-between shadow-2xl animate-slide-in relative">
            
            <div className="flex justify-between items-center border-b border-zinc-150 pb-4 mb-4">
              <h2 className="text-lg font-light uppercase tracking-wider text-zinc-800">Your Wishlist</h2>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1.5 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {wishlistItems.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xs text-zinc-400">Your wishlist is empty.</p>
                  <Link
                    href="/shop"
                    onClick={() => setIsWishlistOpen(false)}
                    className="text-xs text-[#724D26] underline hover:text-[#5a3b1d] block mt-2"
                  >
                    Go back to Shop
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-zinc-100 pb-3 gap-3">
                      <div>
                        <p className="text-sm font-medium text-zinc-800">{item.name}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Price: ₹{item.price ? Number(item.price).toFixed(2) : "0.00"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = wishlistItems.filter((i) => i.id !== item.id);
                            localStorage.setItem("yemnest_wishlist", JSON.stringify(updated));
                            window.dispatchEvent(new Event("yemnest_wishlist_updated"));
                          }}
                          className="text-xs text-zinc-400 hover:text-red-500 underline"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Add to cart
                            const stored = localStorage.getItem("yemnest_cart_items");
                            let items = [];
                            if (stored) {
                              try { items = JSON.parse(stored); } catch (e) {}
                            }
                            const existingIndex = items.findIndex((i: any) => i.product.id === item.id);
                            if (existingIndex > -1) {
                              items[existingIndex].quantity += 1;
                            } else {
                              items.push({ product: item, quantity: 1 });
                            }
                            
                            const lightweightUpdated = items.map((i: any) => ({
                              ...i, product: { ...i.product, image1: "", image2: "", image3: "", image4: "", description: "" }
                            }));
                            localStorage.setItem("yemnest_cart_items", JSON.stringify(lightweightUpdated));
                            const updatedCount = items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0);
                            localStorage.setItem("yemnest_cart_count", updatedCount.toString());
                            window.dispatchEvent(new Event("yemnest_cart_updated"));
                            
                            // Show toast
                            setCartToastName(item.name);
                            setCartToast(true);
                            setTimeout(() => setCartToast(false), 3000);
                            
                            setAddedWishlistIds(prev => [...prev, item.id]);
                            setTimeout(() => {
                              setAddedWishlistIds(prev => prev.filter(id => id !== item.id));
                            }, 2000);
                          }}
                          className={`text-white text-xs px-4 py-2 uppercase tracking-wider transition-colors ${addedWishlistIds.includes(item.id) ? "bg-[#106636]" : "bg-[#106636] hover:bg-[#0c4f29]"}`}
                        >
                          {addedWishlistIds.includes(item.id) ? "✓ Added" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Toast */}
      {cartToast && (
        <div className="fixed bottom-4 right-4 z-[110] bg-[#106636] text-white px-6 py-3 rounded-none shadow-lg animate-fade-in-up flex items-center gap-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-medium text-sm">Added to Cart</p>
            <p className="text-xs text-green-100">{cartToastName}</p>
          </div>
        </div>
      )}
    </nav>
  );
}
