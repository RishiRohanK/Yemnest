"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Toaster, toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  houseNo: string;
  addressLine1: string;
  pincode: string;
  phoneNumber: string;
  alternativeMobileNumber: string;
  createdAt: string;
}

interface Order {
  id: string;
  userId?: string | null;
  userName: string;
  userEmail: string;
  houseNo: string;
  addressLine1: string;
  pincode: string;
  phoneNumber: string;
  alternativeMobileNumber: string;
  items: string;
  totalPrice: number;
  status: string;
  transactionId?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  subLine: string;
  price: number;
  cutoffPrice: number;
  description: string;
  stockCount: number;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  category: string;
}

interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  uses: number;
  createdAt: string;
}

interface Metrics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  salesData: { name: string; revenue: number }[];
  lowStockProducts: { id: string; name: string; stockCount: number; category: string }[];
  inventoryByCategory: { name: string; value: number }[];
}

const COLORS = ['#106636', '#724D26', '#d4af37', '#8A6F54', '#A38B73', '#C1A186'];

interface ImageDropZoneProps {
  index: number;
  image: string;
  setImage: (img: string) => void;
  label: string;
}

function ImageDropZone({ image, setImage, label }: ImageDropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="block text-[9px] uppercase tracking-wider font-normal text-zinc-550">
        {label}
      </label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full aspect-[4/3] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-200 relative overflow-hidden p-2 rounded-none ${
          image
            ? "border-zinc-300 bg-white"
            : dragActive
            ? "border-[#106636] bg-[#106636]/5"
            : "border-zinc-200 hover:border-[#106636] bg-[#FAF9F6]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        {image ? (
          <>
            <div className="relative w-full h-full">
              <Image src={image} alt={label} fill className="object-cover select-none" unoptimized />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImage("");
              }}
              className="absolute top-1.5 right-1.5 p-1 bg-zinc-950/80 hover:bg-zinc-950 text-white rounded-none border border-zinc-700/50 shadow-sm"
              aria-label="Remove image"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-center flex flex-col items-center justify-center p-1">
            <svg className="h-5 w-5 text-zinc-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="text-[8px] text-zinc-500 font-normal">Drop file here</p>
            <p className="text-[7px] text-zinc-400 mt-0.5">or click to choose</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "users" | "products" | "coupons"
  >("overview");
  
  const [metrics, setMetrics] = useState<Metrics>({ 
    totalUsers: 0, 
    totalOrders: 0, 
    totalRevenue: 0,
    salesData: [],
    lowStockProducts: [],
    inventoryByCategory: []
  });
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);
  // Order Filters & Bulk State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);

  // Add/Edit Product Form State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  const [prodName, setProdName] = useState("");
  const [prodSubLine, setProdSubLine] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCutoffPrice, setProdCutoffPrice] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodCategory, setProdCategory] = useState("Atelier Specialties");
  const [customCategory, setCustomCategory] = useState("");
  const [prodImage1, setProdImage1] = useState("");
  const [prodImage2, setProdImage2] = useState("");
  const [prodImage3, setProdImage3] = useState("");
  const [prodImage4, setProdImage4] = useState("");
  
  // Coupon Form State
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.role === "admin") {
          setIsAdminLoggedIn(true);
        } else {
          setIsAdminLoggedIn(false);
        }
      })
      .catch(() => setIsAdminLoggedIn(false))
      .finally(() => setIsCheckingAuth(false));
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchDashboardData();
    }
  }, [isAdminLoggedIn]);

  // Real-time polling for new orders and notifications
  const previousOrderCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/admin/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (e) {
        // Silent fail
      }
    };
    
    // Initial fetch
    fetchNotifications();

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/admin/metrics", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const currentCount = data.metrics.totalOrders;

          // If this is the first fetch by the poller, just set the baseline
          if (previousOrderCountRef.current === null) {
            previousOrderCountRef.current = currentCount;
            return;
          }

          // If count increased, we have a new order!
          if (currentCount > previousOrderCountRef.current) {
            const difference = currentCount - previousOrderCountRef.current;
            toast.success(`🚨 ${difference} New Order(s) Received!`, { 
              duration: 8000,
              icon: '📦',
              style: { border: '1px solid #106636', padding: '16px', color: '#106636', fontWeight: 'bold' }
            });
            
            previousOrderCountRef.current = currentCount;
            
            // Update dashboard state automatically
            setMetrics(data.metrics);
            setOrders(data.orders);
            setUsers(data.users);
            
            // Also fetch new notifications
            fetchNotifications();
          }
        }
        
        // Always poll notifications along with metrics
        fetchNotifications();
      } catch (err) {
        // Silent fail for background poller
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [isAdminLoggedIn]);

  async function fetchDashboardData() {
    setDashboardLoading(true);
    try {
      // Fetch Metrics & Users & Orders
      const resMetrics = await fetch("/api/admin/metrics", { cache: "no-store" });
      const dataMetrics = await resMetrics.json();
      if (resMetrics.ok) {
        setMetrics(dataMetrics.metrics);
        setUsers(dataMetrics.users);
        setOrders(dataMetrics.orders);
      }

      // Fetch Products
      const resProducts = await fetch("/api/products");
      const dataProducts = await resProducts.json();
      if (resProducts.ok) {
        setProducts(dataProducts);
      }

      // Fetch Coupons
      const resCoupons = await fetch("/api/admin/coupons");
      const dataCoupons = await resCoupons.json();
      if (resCoupons.ok) {
        setCoupons(dataCoupons);
      }
    } catch (err) {
      toast.error("Failed to fetch dashboard data.");
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: adminEmail, password: adminPassword, isAdminLogin: true }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed.");
        setIsAdminLoggedIn(true);
        toast.success("Welcome back, Admin!");
      })
      .catch((err) => {
        setLoginError(err.message || "Invalid credentials.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdminLogout = () => {
    fetch("/api/auth/logout", { method: "POST" }).then(() => {
      setIsAdminLoggedIn(false);
      setAdminEmail("");
      setAdminPassword("");
    });
  };

  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Order status updated to ${status}`);
        fetchDashboardData();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (err) {
      toast.error("An error occurred while updating status");
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedOrders.length === 0) return;

    if (status === "PRINT_SLIPS") {
      toast.success(`Preparing to print slips for ${selectedOrders.length} orders...`);
      setTimeout(() => {
        window.print();
        setSelectedOrders([]);
      }, 500);
      return;
    }

    if (!window.confirm(`Update ${selectedOrders.length} orders to ${status}?`)) return;

    setIsUpdatingBulk(true);
    try {
      const res = await fetch(`/api/admin/orders/bulk`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrders, status }),
      });
      if (res.ok) {
        toast.success(`Successfully updated ${selectedOrders.length} orders`);
        setSelectedOrders([]);
        fetchDashboardData();
      } else {
        toast.error("Failed to update orders");
      }
    } catch (err) {
      toast.error("An error occurred while updating status");
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const openAddProductForm = () => {
    setIsEditingProduct(true);
    setEditingProductId(null);
    setProdName("");
    setProdSubLine("");
    setProdPrice("");
    setProdCutoffPrice("");
    setProdDescription("");
    setProdStock("");
    setProdImage1("");
    setProdImage2("");
    setProdImage3("");
    setProdImage4("");
    setProdCategory("Atelier Specialties");
    setCustomCategory("");
  };

  const openEditProductForm = (p: Product) => {
    setIsEditingProduct(true);
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdSubLine(p.subLine);
    setProdPrice(p.price.toString());
    setProdCutoffPrice(p.cutoffPrice.toString());
    setProdDescription(p.description);
    setProdStock(p.stockCount.toString());
    setProdImage1(p.image1);
    setProdImage2(p.image2);
    setProdImage3(p.image3);
    setProdImage4(p.image4);
    setProdCategory(p.category);
    setCustomCategory("");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchDashboardData();
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const finalCategory = prodCategory === "Other" ? customCategory.trim() : prodCategory;

    if (
      !prodName ||
      !prodSubLine ||
      !prodPrice ||
      !prodCutoffPrice ||
      !prodDescription ||
      !prodStock ||
      !finalCategory
    ) {
      toast.error("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    const endpoint = editingProductId ? `/api/products/${editingProductId}` : "/api/products";
    const method = editingProductId ? "PUT" : "POST";

    fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: prodName,
        subLine: prodSubLine,
        price: parseFloat(prodPrice),
        cutoffPrice: parseFloat(prodCutoffPrice),
        description: prodDescription,
        stockCount: parseInt(prodStock, 10),
        image1: prodImage1,
        image2: prodImage2,
        image3: prodImage3,
        image4: prodImage4,
        category: finalCategory,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save product.");
        toast.success("Product saved successfully!");
        fetchDashboardData();
        setTimeout(() => setIsEditingProduct(false), 500);
      })
      .catch((err) => {
        toast.error(err.message || "An error occurred.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    if (!couponCode || !couponDiscount) {
      toast.error("Please fill out both fields.");
      return;
    }

    fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: couponCode,
        discountPercentage: parseFloat(couponDiscount),
        isActive: true,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create coupon.");
        toast.success("Discount code created!");
        setCouponCode("");
        setCouponDiscount("");
        fetchDashboardData();
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleToggleCoupon = async (id: string, currentStatus: boolean) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this discount code?`)) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        toast.success(`Coupon ${action}d successfully`);
        fetchDashboardData();
      } else {
        toast.error(`Failed to ${action} coupon.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    }
  };

  const handlePrintInvoice = (orderId: string) => {
    window.open(`/admin/print/${orderId}`, '_blank');
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    
    const matchesTime = (() => {
      if (timeFilter === "ALL") return true;
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      if (timeFilter === "TODAY") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (timeFilter === "THIS_WEEK") {
        // Last 7 days
        const diff = now.getTime() - orderDate.getTime();
        return diff <= 7 * 24 * 60 * 60 * 1000;
      }
      if (timeFilter === "THIS_MONTH") {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      if (timeFilter.startsWith("MONTH_")) {
        const monthIndex = parseInt(timeFilter.split("_")[1], 10);
        return orderDate.getMonth() === monthIndex && orderDate.getFullYear() === now.getFullYear();
      }
      return true;
    })();
    
    return matchesSearch && matchesStatus && matchesTime;
  });

  const allCategories = Array.from(new Set([
    "Kunafa Bars",
    "Biscoff Filling Kunafa Bars",
    "Pistachio Filling Kunafa",
    "Nutella Filling Kunafa Bars",
    "Gift Boxes",
    "Atelier Specialties",
    ...products.map(p => p.category)
  ]));

  // Render Loading State while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[75vh] bg-[#FAF9F6]">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
           <svg
             className="animate-spin h-8 w-8 text-[#106636]"
             fill="none"
             viewBox="0 0 24 24"
           >
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
           </svg>
           <p className="text-sm text-zinc-500 uppercase tracking-widest">Checking access...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to the main unified signin page
  if (!isAdminLoggedIn) {
    // We cannot call router.push during render, so we use a small effect trick or window.location directly
    if (typeof window !== "undefined") {
      setTimeout(() => {
        router.push("/signin");
      }, 0);
    }
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
           <svg
             className="animate-spin h-8 w-8 text-[#106636]"
             fill="none"
             viewBox="0 0 24 24"
           >
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
           </svg>
           <p className="text-sm text-zinc-500 uppercase tracking-widest">Redirecting to Sign In...</p>
        </div>
      </div>
    );
  }

  // Helper to parse JSON items safely
  const renderOrderItemsList = (itemsStr: string) => {
    try {
      const parsed = JSON.parse(itemsStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any, i) => (
          <div key={item.id || i} className="text-xs text-zinc-600">
            • {item.name} (Qty: {item.quantity}) - ₹{item.price.toFixed(2)}
          </div>
        ));
      }
    } catch (e) {
      // Fallback
    }
    return <span className="text-xs text-zinc-500">{itemsStr}</span>;
  };

  // Render Dashboard
  return (
    <div className="flex-1 min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row text-zinc-900 font-sans">
      <Toaster position="top-right" toastOptions={{ className: 'rounded-none text-sm shadow-sm border border-zinc-200' }} />
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-900 text-zinc-300 flex flex-col justify-between py-6 min-h-screen">
        <div>
          <div className="px-6 pb-6 border-b border-zinc-850">
            <h2 className="text-sm uppercase tracking-widest text-[#F5E6C4] font-medium">
              Admin Panel
            </h2>
            <p className="text-[10px] text-zinc-500 mt-1">Yemnest Dashboard</p>
          </div>

          <nav className="mt-6 space-y-1 px-4">
            <button
              onClick={() => { setActiveTab("overview"); setIsEditingProduct(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-normal transition-colors ${
                activeTab === "overview" && !isEditingProduct
                  ? "bg-[#106636] text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => { setActiveTab("orders"); setIsEditingProduct(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-normal transition-colors ${
                activeTab === "orders"
                  ? "bg-[#106636] text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              Orders list
            </button>
            <button
              onClick={() => { setActiveTab("products"); setIsEditingProduct(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-normal transition-colors ${
                activeTab === "products"
                  ? "bg-[#106636] text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              Manage Products
            </button>
            <button
              onClick={() => { setActiveTab("users"); setIsEditingProduct(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-normal transition-colors ${
                activeTab === "users"
                  ? "bg-[#106636] text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              Registered Users
            </button>
            <button
              onClick={() => { setActiveTab("coupons"); setIsEditingProduct(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-normal transition-colors ${
                activeTab === "coupons"
                  ? "bg-[#106636] text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              Discount Codes
            </button>
          </nav>
        </div>

        <div className="px-4 mt-6">
          <button
            onClick={handleAdminLogout}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white text-xs uppercase tracking-wider transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-10 w-full overflow-x-hidden">
        <div className="flex justify-between items-center border-b border-zinc-200 pb-4 mb-6">
          <h1 className="text-2xl font-light capitalize tracking-wide">
            {activeTab === "overview" && "System Overview"}
            {activeTab === "orders" && "Customer Orders"}
            {activeTab === "products" && "Product Inventory"}
            {activeTab === "users" && "Registered Users"}
            {activeTab === "coupons" && "Discount Codes"}
          </h1>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 relative rounded-full hover:bg-zinc-100 transition-colors"
              >
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 text-[8px] text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 shadow-lg z-50 rounded-none overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-100 bg-zinc-50">
                    <span className="font-semibold text-xs text-zinc-700 uppercase tracking-widest">Notifications</span>
                    {unreadNotifications > 0 && (
                      <button 
                        onClick={async () => {
                          await fetch("/api/admin/notifications", {
                            method: "POST",
                            body: JSON.stringify({ action: "mark_all_read" })
                          });
                          setNotifications(notifications.map(n => ({...n, isRead: true})));
                        }}
                        className="text-[10px] text-[#106636] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-zinc-500">No recent notifications</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-zinc-100 text-xs ${!notif.isRead ? 'bg-[#106636]/5' : ''}`}>
                          <div className="text-zinc-800">{notif.message}</div>
                          <div className="text-zinc-400 mt-1 text-[10px]">{new Date(notif.createdAt).toLocaleString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={dashboardLoading}
              className="px-4 py-1.5 border border-zinc-300 bg-[#FEFEFD] hover:bg-zinc-50 text-xs transition-all uppercase tracking-wider disabled:opacity-50"
            >
              {dashboardLoading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Metric Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#FEFEFD] p-6 border border-zinc-200 shadow-sm">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                  Total Revenue
                </span>
                <span className="text-2xl font-semibold text-[#724D26]">
                  ₹{metrics.totalRevenue.toFixed(2)}
                </span>
              </div>

              <div className="bg-[#FEFEFD] p-6 border border-zinc-200 shadow-sm">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                  Orders Placed
                </span>
                <span className="text-2xl font-semibold text-[#106636]">
                  {metrics.totalOrders}
                </span>
              </div>

              <div className="bg-[#FEFEFD] p-6 border border-zinc-200 shadow-sm">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                  Registered Clients
                </span>
                <span className="text-2xl font-semibold text-zinc-800">
                  {metrics.totalUsers}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="lg:col-span-2 bg-[#FEFEFD] border border-zinc-200 p-6 shadow-sm">
                <h2 className="text-xs uppercase tracking-widest text-zinc-700 font-semibold mb-6">
                  Sales Last 7 Days
                </h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} dx={-10} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '0px', border: '1px solid #e4e4e7', fontSize: '12px' }}
                        itemStyle={{ color: '#106636' }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#106636" strokeWidth={3} dot={{ r: 4, fill: '#106636', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Low Stock Widget */}
              <div className="bg-[#FEFEFD] border border-zinc-200 p-6 shadow-sm">
                <h2 className="text-xs uppercase tracking-widest text-red-600 font-semibold mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Low Stock Alerts
                </h2>
                {metrics.lowStockProducts.length === 0 ? (
                  <p className="text-xs text-zinc-500">All products are adequately stocked.</p>
                ) : (
                  <div className="space-y-4">
                    {metrics.lowStockProducts.map(p => (
                      <div key={p.id} className="flex justify-between items-center border-b border-zinc-100 pb-3">
                        <div>
                          <p className="text-sm font-semibold text-zinc-800">{p.name}</p>
                          <p className="text-[10px] text-zinc-400">{p.category}</p>
                        </div>
                        <div className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                          {p.stockCount} left
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Pie Chart */}
            <div className="bg-[#FEFEFD] border border-zinc-200 p-6 shadow-sm mt-6">
              <h2 className="text-xs uppercase tracking-widest text-zinc-700 font-semibold mb-6">
                Inventory Distribution by Category
              </h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.inventoryByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {metrics.inventoryByCategory && metrics.inventoryByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '0px', border: '1px solid #e4e4e7', fontSize: '12px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#555' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="animate-fade-in space-y-4">
            
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#FEFEFD] border border-zinc-200 p-4 shadow-sm">
              <div className="flex flex-1 gap-4">
                <input 
                  type="text" 
                  placeholder="Search by customer name, email, or order ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 max-w-md px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none"
                />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none"
                >
                  <option value="ALL">All Time</option>
                  <option value="TODAY">New Orders (Today)</option>
                  <option value="THIS_WEEK">This Week</option>
                  <option value="THIS_MONTH">This Month</option>
                  <optgroup label="Specific Months (This Year)">
                    <option value="MONTH_0">January</option>
                    <option value="MONTH_1">February</option>
                    <option value="MONTH_2">March</option>
                    <option value="MONTH_3">April</option>
                    <option value="MONTH_4">May</option>
                    <option value="MONTH_5">June</option>
                    <option value="MONTH_6">July</option>
                    <option value="MONTH_7">August</option>
                    <option value="MONTH_8">September</option>
                    <option value="MONTH_9">October</option>
                    <option value="MONTH_10">November</option>
                    <option value="MONTH_11">December</option>
                  </optgroup>
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedOrders.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 font-medium">{selectedOrders.length} selected</span>
                  <select 
                    onChange={(e) => {
                      if(e.target.value) handleBulkStatusUpdate(e.target.value);
                      e.target.value = "";
                    }}
                    className="px-3 py-2 bg-[#106636] text-white border border-[#106636] focus:outline-none text-xs uppercase tracking-wider cursor-pointer"
                    disabled={isUpdatingBulk}
                  >
                    <option value="">Bulk Action...</option>
                    <option value="PRINT_SLIPS">Print Slips</option>
                    <option value="SHIPPED">Mark as Shipped</option>
                    <option value="DELIVERED">Mark as Delivered</option>
                    <option value="CANCELLED">Mark as Cancelled</option>
                  </select>
                </div>
              )}
            </div>

            {/* Orders Table */}
            <div className="bg-[#FEFEFD] border border-zinc-200 p-6 shadow-sm">
              {filteredOrders.length === 0 ? (
                <p className="text-xs text-zinc-400">No orders found matching your search.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[950px]">
                    <thead>
                      <tr className="border-b border-zinc-250 text-zinc-500 uppercase tracking-wider">
                        <th className="py-2.5 px-2">
                          <input 
                            type="checkbox" 
                            checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                            onChange={toggleAllSelection}
                            className="cursor-pointer"
                          />
                        </th>
                        <th className="py-2.5 font-medium">Customer Details</th>
                        <th className="py-2.5 font-medium">Shipping Address</th>
                        <th className="py-2.5 font-medium">Items Ordered</th>
                        <th className="py-2.5 font-medium">Price</th>
                        <th className="py-2.5 font-medium">Order Date</th>
                        <th className="py-2.5 font-medium">Status / Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-zinc-150 hover:bg-zinc-50/50 align-top transition-colors">
                          <td className="py-4 px-2">
                            <input 
                              type="checkbox" 
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => toggleOrderSelection(order.id)}
                              className="cursor-pointer"
                            />
                          </td>
                          <td className="py-4">
                            <div className="font-semibold text-zinc-800">{order.userName}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5 mb-2">{order.userEmail}</div>
                            <div className="text-[9px] font-mono text-zinc-500 bg-zinc-50 border border-zinc-100 p-1.5 rounded inline-block">
                              <div className="text-zinc-400 mb-0.5">ORDER ID</div>
                              <div className="font-semibold text-zinc-700">#{order.id.slice(0,8).toUpperCase()}</div>
                              {order.transactionId && (
                                <>
                                  <div className="text-zinc-400 mt-1.5 mb-0.5">TXN ID</div>
                                  <div className="font-semibold text-zinc-700">{order.transactionId}</div>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-zinc-600 max-w-xs">
                            <div>{order.houseNo}, {order.addressLine1}</div>
                            <div>Pin: {order.pincode}</div>
                            <div className="mt-1">Ph: {order.phoneNumber}</div>
                          </td>
                          <td className="py-4 pr-4">
                            {renderOrderItemsList(order.items)}
                          </td>
                          <td className="py-4 font-semibold text-[#724D26]">
                            ₹{order.totalPrice.toFixed(2)}
                          </td>
                          <td className="py-4">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-0.5">Placed On</div>
                            <div className="text-zinc-700 font-medium text-xs mb-3">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              <div className="text-[10px] font-normal text-zinc-400 mt-0.5">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            
                            {order.status === 'DELIVERED' && (
                              <>
                                <div className="text-[10px] uppercase tracking-widest text-[#106636] font-semibold mb-0.5">Delivered On</div>
                                <div className="text-zinc-700 font-medium text-xs">
                                  {order.deliveredAt 
                                    ? new Date(order.deliveredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                    : "Not recorded"}
                                </div>
                              </>
                            )}
                          </td>
                          <td className="py-4 space-y-2">
                            <select 
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                              className={`w-full px-2 py-1 outline-none text-xs font-semibold cursor-pointer border ${
                                order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                                'bg-zinc-50 text-zinc-700 border-zinc-200'
                              }`}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                            <button 
                              onClick={() => handlePrintInvoice(order.id)}
                              className="w-full flex items-center justify-center gap-1.5 px-2 py-1 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 uppercase tracking-widest transition-colors text-[9px]"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                              Print Slip
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && !isEditingProduct && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <button 
                onClick={openAddProductForm}
                className="bg-[#106636] text-white px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-zinc-900 transition-colors"
              >
                + Add New Product
              </button>
            </div>
            
            <div className="bg-[#FEFEFD] border border-zinc-200 p-6 shadow-sm">
              {products.length === 0 ? (
                <p className="text-xs text-zinc-400">No products found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-zinc-250 text-zinc-500 uppercase tracking-wider">
                        <th className="py-2.5 font-medium">Product</th>
                        <th className="py-2.5 font-medium">Category</th>
                        <th className="py-2.5 font-medium">Price</th>
                        <th className="py-2.5 font-medium">Stock</th>
                        <th className="py-2.5 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-zinc-150 hover:bg-zinc-50/50 align-middle">
                          <td className="py-3 flex items-center gap-3">
                            <div className="relative w-10 h-10 border border-zinc-200">
                              <Image src={product.image1} alt={product.name} fill className="object-cover" unoptimized />
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-800">{product.name}</div>
                              <div className="text-[10px] text-zinc-500">{product.subLine}</div>
                            </div>
                          </td>
                          <td className="py-3 text-zinc-600">{product.category}</td>
                          <td className="py-3 text-[#724D26] font-semibold">₹{product.price.toFixed(2)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 border ${product.stockCount <= 5 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                              {product.stockCount}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => openEditProductForm(product)} className="text-[#106636] hover:underline uppercase tracking-wider text-[10px]">Edit</button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:underline uppercase tracking-wider text-[10px]">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add / Edit Product Form */}
        {activeTab === "products" && isEditingProduct && (
          <div className="bg-[#FEFEFD] border border-zinc-200 p-6 animate-fade-in max-w-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
              <h2 className="text-lg font-semibold text-zinc-800">
                {editingProductId ? "Edit Product" : "Add New Product"}
              </h2>
              <button 
                onClick={() => setIsEditingProduct(false)}
                className="text-xs uppercase tracking-widest text-zinc-500 hover:text-black"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Name & SubLine */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none"
                    placeholder="e.g. Pistachio Kunafa Bar"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-1">
                    Sub Line / Subtitle
                  </label>
                  <input
                    type="text"
                    required
                    value={prodSubLine}
                    onChange={(e) => setProdSubLine(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none"
                    placeholder="e.g. Crispy pistachio filled chocolate"
                  />
                </div>
              </div>

              {/* Pricing & Stock & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none"
                    placeholder="499.00"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-1">
                    Cutoff Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodCutoffPrice}
                    onChange={(e) => setProdCutoffPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none"
                    placeholder="799.00"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-1">
                    Stock count
                  </label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-1">
                    Category
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none cursor-pointer"
                  >
                    {allCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {prodCategory === "Other" && (
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none"
                      placeholder="Type custom category name..."
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs rounded-none resize-none"
                  placeholder="Enter detailed description..."
                />
              </div>

              {/* 4 Image Dropzones */}
              <div className="space-y-3">
                <span className="block text-[10px] uppercase tracking-wider font-medium text-[#724D26] border-b border-zinc-100 pb-1">
                  Product Images (Drag and drop or click to choose)
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ImageDropZone index={1} image={prodImage1} setImage={setProdImage1} label="Main Image" />
                  <ImageDropZone index={2} image={prodImage2} setImage={setProdImage2} label="Image 2" />
                  <ImageDropZone index={3} image={prodImage3} setImage={setProdImage3} label="Image 3" />
                  <ImageDropZone index={4} image={prodImage4} setImage={setProdImage4} label="Image 4" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 bg-[#106636] hover:bg-zinc-900 text-white uppercase tracking-wider text-xs rounded-none disabled:bg-zinc-700 transition-colors"
                >
                  {isLoading ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === "coupons" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#FEFEFD] border border-zinc-200 p-6 shadow-sm max-w-md">
              <h2 className="text-xs uppercase tracking-widest text-zinc-700 font-semibold mb-4">Create Discount Code</h2>
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs uppercase"
                    placeholder="e.g. SUMMER20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-zinc-500 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-zinc-200 focus:outline-none focus:border-[#106636] text-xs"
                    placeholder="e.g. 20"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white uppercase text-xs tracking-wider">
                  Create Coupon
                </button>
              </form>
            </div>

            <div className="bg-[#FEFEFD] border border-zinc-200 p-6 shadow-sm">
              <h2 className="text-xs uppercase tracking-widest text-zinc-700 font-semibold mb-4">Active Discount Codes</h2>
              {coupons.length === 0 ? (
                <p className="text-xs text-zinc-400">No coupons created yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-zinc-250 text-zinc-500 uppercase tracking-wider">
                        <th className="py-2.5 font-medium">Code</th>
                        <th className="py-2.5 font-medium">Discount</th>
                        <th className="py-2.5 font-medium">Status</th>
                        <th className="py-2.5 font-medium">Times Used</th>
                        <th className="py-2.5 font-medium">Created On</th>
                        <th className="py-2.5 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((c) => (
                        <tr key={c.id} className="border-b border-zinc-150 hover:bg-zinc-50/50">
                          <td className="py-3 font-semibold text-zinc-800 font-mono tracking-wider">{c.code}</td>
                          <td className="py-3 text-[#106636] font-bold">{c.discountPercentage}% OFF</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 border ${c.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                              {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                          <td className="py-3 text-zinc-600">{c.uses}</td>
                          <td className="py-3 text-zinc-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 text-right">
                            <button 
                              onClick={() => handleToggleCoupon(c.id, c.isActive)} 
                              className={`${c.isActive ? 'text-red-600' : 'text-green-600'} hover:underline uppercase tracking-wider text-[10px] font-semibold`}
                            >
                              {c.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-[#FEFEFD] border border-zinc-200 p-6 animate-fade-in shadow-sm">
            {users.length === 0 ? (
              <p className="text-xs text-zinc-400">No registered users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-250 text-zinc-500 uppercase tracking-wider">
                      <th className="py-2.5 font-medium">Name</th>
                      <th className="py-2.5 font-medium">Email</th>
                      <th className="py-2.5 font-medium">Address</th>
                      <th className="py-2.5 font-medium">Contact Numbers</th>
                      <th className="py-2.5 font-medium">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-zinc-150 hover:bg-zinc-50/50 align-top">
                        <td className="py-4">
                          <div className="font-semibold text-zinc-800">{user.name}</div>
                          <div className="text-[9px] font-mono text-zinc-400 mt-1">ID: {user.id}</div>
                        </td>
                        <td className="py-4 text-zinc-600">{user.email}</td>
                        <td className="py-4 text-zinc-600">
                          <div>House: {user.houseNo}</div>
                          <div>{user.addressLine1}</div>
                          <div>Pin: {user.pincode}</div>
                        </td>
                        <td className="py-4 text-zinc-600">
                          <div>Primary: {user.phoneNumber}</div>
                          <div>Alt: {user.alternativeMobileNumber}</div>
                        </td>
                        <td className="py-4 text-zinc-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
