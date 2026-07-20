"use client";

import { useState, useEffect, useRef } from "react";

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
  items: string; // JSON serialized string of items
  totalPrice: number;
  createdAt: string;
}

interface Metrics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

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
      alert("Please select or drop an image file.");
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
            <img src={image} alt={label} className="w-full h-full object-cover select-none" />
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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "users" | "add-product">("overview");
  const [metrics, setMetrics] = useState<Metrics>({ totalUsers: 0, totalOrders: 0, totalRevenue: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Add Product Form State
  const [prodName, setProdName] = useState("");
  const [prodSubLine, setProdSubLine] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCutoffPrice, setProdCutoffPrice] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodCategory, setProdCategory] = useState("Atelier Specialties");
  const [prodImage1, setProdImage1] = useState("");
  const [prodImage2, setProdImage2] = useState("");
  const [prodImage3, setProdImage3] = useState("");
  const [prodImage4, setProdImage4] = useState("");
  const [productError, setProductError] = useState("");
  const [productSuccess, setProductSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("yemnest_admin_logged_in") === "true";
      setIsAdminLoggedIn(logged);
    }
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchDashboardData();
    }
  }, [isAdminLoggedIn]);

  const fetchDashboardData = () => {
    setDashboardLoading(true);
    fetch("/api/admin/metrics")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load data.");
        setMetrics(data.metrics);
        setUsers(data.users);
        setOrders(data.orders);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setDashboardLoading(false);
      });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed.");
        localStorage.setItem("yemnest_admin_logged_in", "true");
        setIsAdminLoggedIn(true);
      })
      .catch((err) => {
        setLoginError(err.message || "Invalid credentials.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("yemnest_admin_logged_in");
    setIsAdminLoggedIn(false);
    setAdminEmail("");
    setAdminPassword("");
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProductError("");
    setProductSuccess(false);
    setIsLoading(true);

    if (
      !prodName ||
      !prodSubLine ||
      !prodPrice ||
      !prodCutoffPrice ||
      !prodDescription ||
      !prodStock ||
      !prodImage1 ||
      !prodImage2 ||
      !prodImage3 ||
      !prodImage4 ||
      !prodCategory
    ) {
      setProductError("Please fill in all fields, including all 4 images.");
      setIsLoading(false);
      return;
    }

    fetch("/api/products", {
      method: "POST",
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
        category: prodCategory,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create product.");
        setProductSuccess(true);
        // Clear fields
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
        fetchDashboardData();
      })
      .catch((err) => {
        setProductError(err.message || "An error occurred.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Render Login Form
  if (!isAdminLoggedIn) {
    return (
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAF9F6] text-zinc-900 font-sans min-h-[75vh]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-light tracking-tight text-zinc-900">
            Admin Sign In
          </h1>
          <p className="mt-2 text-center text-xs text-zinc-500 uppercase tracking-widest">
            Enter administrator credentials
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#FEFEFD] py-8 px-4 shadow-sm border border-zinc-200/60 sm:px-10 rounded-none">
            <form onSubmit={handleAdminLogin} className="space-y-6">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-none">
                  {loginError}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-wider font-normal text-zinc-650 mb-2">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm focus:outline-none focus:border-[#106636] focus:bg-white rounded-none"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs uppercase tracking-wider font-normal text-zinc-650 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="block w-full px-4 py-3 bg-[#FAF9F6] border border-zinc-200/80 text-zinc-900 text-sm focus:outline-none focus:border-[#106636] focus:bg-white rounded-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white uppercase tracking-wider text-xs rounded-none disabled:bg-zinc-700"
              >
                {isLoading ? "Verifying..." : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Helper to parse JSON items safely
  const renderOrderItemsList = (itemsStr: string) => {
    try {
      const parsed = JSON.parse(itemsStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => (
          <div key={item.id} className="text-xs text-zinc-600">
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
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-900 text-zinc-300 flex flex-col justify-between py-6">
        <div>
          <div className="px-6 pb-6 border-b border-zinc-850">
            <h2 className="text-sm uppercase tracking-widest text-[#F5E6C4] font-medium">
              Admin Panel
            </h2>
            <p className="text-[10px] text-zinc-500 mt-1">Yemnest Dashboard</p>
          </div>

          <nav className="mt-6 space-y-1 px-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-normal transition-colors ${
                activeTab === "overview"
                  ? "bg-[#106636] text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-normal transition-colors ${
                activeTab === "orders"
                  ? "bg-[#106636] text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              Orders list
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-normal transition-colors ${
                activeTab === "users"
                  ? "bg-[#106636] text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              Users list
            </button>
            <button
              onClick={() => setActiveTab("add-product")}
              className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-normal transition-colors ${
                activeTab === "add-product"
                  ? "bg-[#106636] text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              Add Product
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
      <main className="flex-1 p-6 md:p-10">
        <div className="flex justify-between items-center border-b border-zinc-200 pb-4 mb-6">
          <h1 className="text-2xl font-light capitalize tracking-wide">
            {activeTab === "overview" && "System Overview"}
            {activeTab === "orders" && "Customer Orders"}
            {activeTab === "users" && "Registered Users"}
            {activeTab === "add-product" && "Add New Chocolate"}
          </h1>
          <button
            onClick={fetchDashboardData}
            disabled={dashboardLoading}
            className="px-4 py-1.5 border border-zinc-300 bg-[#FEFEFD] hover:bg-zinc-50 text-xs transition-all uppercase tracking-wider disabled:opacity-50"
          >
            {dashboardLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Metric Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#FEFEFD] p-6 border border-zinc-200 shadow-sm">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                  Total Sales
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

            {/* Quick overview table */}
            <div className="bg-[#FEFEFD] border border-zinc-200 p-6">
              <h2 className="text-xs uppercase tracking-widest text-[#724D26] font-semibold mb-4">
                Recent Orders Summary
              </h2>
              {orders.length === 0 ? (
                <p className="text-xs text-zinc-400">No orders placed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-250 text-zinc-500 uppercase tracking-wider">
                        <th className="py-2.5 font-medium">Customer</th>
                        <th className="py-2.5 font-medium">Date</th>
                        <th className="py-2.5 font-medium">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                          <td className="py-3 font-normal">
                            <div>{order.userName}</div>
                            <div className="text-[9px] font-mono text-zinc-400">ID: {order.id}</div>
                          </td>
                          <td className="py-3 text-zinc-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 font-semibold text-zinc-700">
                            ₹{order.totalPrice.toFixed(2)}
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

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-[#FEFEFD] border border-zinc-200 p-6 animate-fade-in">
            {orders.length === 0 ? (
              <p className="text-xs text-zinc-400">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-zinc-250 text-zinc-500 uppercase tracking-wider">
                      <th className="py-2.5 font-medium">Customer Details</th>
                      <th className="py-2.5 font-medium">Full Shipping Address</th>
                      <th className="py-2.5 font-medium">Items Ordered</th>
                      <th className="py-2.5 font-medium">Price</th>
                      <th className="py-2.5 font-medium">Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-zinc-150 hover:bg-zinc-50/50 align-top">
                        <td className="py-4">
                          <div className="font-semibold text-zinc-800">{order.userName}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{order.userEmail}</div>
                          <div className="text-[9px] font-mono text-zinc-400 mt-1">Order ID: {order.id}</div>
                          {order.userId && (
                            <div className="text-[9px] font-mono text-zinc-400 mt-0.5">User ID: {order.userId}</div>
                          )}
                        </td>
                        <td className="py-4 text-zinc-600 max-w-xs">
                          <div>
                            <strong>House No:</strong> {order.houseNo}
                          </div>
                          <div>
                            <strong>Street:</strong> {order.addressLine1}
                          </div>
                          <div>
                            <strong>Pin Code:</strong> {order.pincode}
                          </div>
                          <div className="mt-1">
                            <strong>Phone:</strong> {order.phoneNumber}
                          </div>
                          <div>
                            <strong>Alt Phone:</strong> {order.alternativeMobileNumber}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          {renderOrderItemsList(order.items)}
                        </td>
                        <td className="py-4 font-semibold text-[#724D26]">
                          ₹{order.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-4 text-zinc-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-[#FEFEFD] border border-zinc-200 p-6 animate-fade-in">
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
                          <div className="text-[9px] font-mono text-zinc-400 mt-1">User ID: {user.id}</div>
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

        {/* Add Product Tab */}
        {activeTab === "add-product" && (
          <div className="bg-[#FEFEFD] border border-zinc-200 p-6 animate-fade-in max-w-2xl">
            <form onSubmit={handleCreateProduct} className="space-y-4">
              {productSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-[#106636] text-xs font-medium rounded-none animate-fade-in">
                  Product created successfully!
                </div>
              )}
              {productError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-none">
                  {productError}
                </div>
              )}

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
                    <option value="Kunafa Bars">Kunafa Bars</option>
                    <option value="Gift Boxes">Gift Boxes</option>
                    <option value="Atelier Specialties">Atelier Specialties</option>
                  </select>
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 bg-zinc-900 hover:bg-zinc-800 text-white uppercase tracking-wider text-xs rounded-none disabled:bg-zinc-700 transition-colors"
                >
                  {isLoading ? "Submitting..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
