"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Pagination from "../../components/Pagination";
import styles from "./admin.module.css";

// Placeholders for Cloudinary
const CLOUDINARY_CLOUD_NAME = "dswcxuvoi";
const CLOUDINARY_UPLOAD_PRESET = "wl2f9b3m";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  
  // State for testimonials list
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [feedbacksError, setFeedbacksError] = useState("");
  
  // State for cakes list
  const [cakes, setCakes] = useState([]);
  const [loadingCakes, setLoadingCakes] = useState(false);
  const [cakesError, setCakesError] = useState("");
  
  // Form state for adding cake
  const [cakeForm, setCakeForm] = useState({
    name: "",
    category: "birthday",
    price: "",
    minWeight: "",
    maxWeight: "",
    ingredients: "",
    available: true,
  });
  const [cakeImage, setCakeImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingCake, setSubmittingCake] = useState(false);
  const [cakeError, setCakeError] = useState("");
  const [cakeSuccess, setCakeSuccess] = useState("");
  const [editingCakeId, setEditingCakeId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Pagination state
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [cakesPage, setCakesPage] = useState(1);
  const [cakesTotalPages, setCakesTotalPages] = useState(1);

  // Orders Search & Filter state
  const [ordersSearch, setOrdersSearch] = useState("");
  const [ordersStatusFilter, setOrdersStatusFilter] = useState("");
  const [ordersPaymentFilter, setOrdersPaymentFilter] = useState("");
  const [ordersDateFrom, setOrdersDateFrom] = useState("");
  const [ordersDateTo, setOrdersDateTo] = useState("");

  // Cakes Search & Filter state
  const [cakesSearch, setCakesSearch] = useState("");
  const [cakesCategoryFilter, setCakesCategoryFilter] = useState("");
  const [cakesAvailableFilter, setCakesAvailableFilter] = useState("");

  const router = useRouter();

  // Check auth and fetch data
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "cakes") {
      fetchCakes();
    } else if (activeTab === "testimonials") {
      fetchFeedbacks();
    }
  }, [
    activeTab,
    router,
    ordersPage,
    cakesPage,
    ordersSearch,
    ordersStatusFilter,
    ordersDateFrom,
    ordersDateTo,
    cakesSearch,
    cakesCategoryFilter,
    cakesAvailableFilter,
    ordersPaymentFilter
  ]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrdersError("");
    try {
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams();
      params.set('page', ordersPage.toString());
      params.set('limit', '10');
      if (ordersSearch) params.set('search', ordersSearch);
      if (ordersStatusFilter) params.set('status', ordersStatusFilter);
      if (ordersPaymentFilter) params.set('paymentStatus', ordersPaymentFilter);
      if (ordersDateFrom) params.set('from', ordersDateFrom);
      if (ordersDateTo) params.set('to', ordersDateTo);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch orders");
      setOrders(data.data);
      setOrdersTotalPages(data.pagination?.totalPages || 1);
    } catch (err: any) {
      setOrdersError(err.message || "Error fetching orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCakes = async () => {
    setLoadingCakes(true);
    setCakesError("");
    try {
      const params = new URLSearchParams();
      params.set('page', cakesPage.toString());
      params.set('limit', '10');
      if (cakesSearch) params.set('search', cakesSearch);
      if (cakesCategoryFilter && cakesCategoryFilter !== 'all') {
        params.set('category', cakesCategoryFilter);
      }
      if (cakesAvailableFilter) params.set('available', cakesAvailableFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cakes?${params.toString()}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch cakes");
      setCakes(data.data);
      setCakesTotalPages(data.pagination?.totalPages || 1);
    } catch (err: any) {
      setCakesError(err.message || "Error fetching cakes");
    } finally {
      setLoadingCakes(false);
    }
  };

  const fetchFeedbacks = async () => {
    setLoadingFeedbacks(true);
    setFeedbacksError("");
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/feedback`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch testimonials");
      setFeedbacks(data.data || []);
    } catch (err: any) {
      setFeedbacksError(err.message || "Error fetching testimonials");
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/feedback/${feedbackId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete testimonial");
      
      setFeedbacks((prev) => prev.filter((item: any) => item._id !== feedbackId));
      alert("Testimonial deleted successfully!");
    } catch (err: any) {
      alert(err.message || "Error deleting testimonial");
    }
  };

  const handleEditClick = (cake: any) => {
    setCakeForm({
      name: cake.name,
      category: cake.category,
      price: cake.price.toString(),
      minWeight: cake.sizeWeight.min.toString(),
      maxWeight: cake.sizeWeight.max.toString(),
      ingredients: cake.ingredients.join(", "),
      available: cake.available,
    });
    setImagePreview(cake.imageUrl);
    setEditingCakeId(cake._id);
    setActiveTab("add-cake"); // Switch to form tab
  };

  const handleToggleAvailability = async (cakeId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cakes/${cakeId}/toggle-availability`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to toggle availability");
      
      // Update local state
      setCakes((prev: any) =>
        prev.map((cake: any) =>
          cake._id === cakeId ? { ...cake, available: !cake.available } : cake
        )
      );
    } catch (err: any) {
      alert(err.message || "Error toggling availability");
    }
  };

  const handleAddPayment = async (orderId: string, amount: number, method: string, note: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/${orderId}/payments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, method, note }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add payment");

      // Update selectedOrder and orders list
      setSelectedOrder(data.data);
      setOrders((prev: any) =>
        prev.map((o: any) => (o._id === orderId ? data.data : o))
      );
      return true;
    } catch (err: any) {
      alert(err.message || "Error adding payment");
      return false;
    }
  };

  const handleRemovePayment = async (orderId: string, paymentId: string) => {
    if (!confirm("Remove this payment entry?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/${orderId}/payments/${paymentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to remove payment");

      setSelectedOrder(data.data);
      setOrders((prev: any) =>
        prev.map((o: any) => (o._id === orderId ? data.data : o))
      );
    } catch (err: any) {
      alert(err.message || "Error removing payment");
    }
  };

  const handleDeleteClick = async (cakeId: string) => {
    if (!confirm("Are you sure you want to delete this cake?")) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cakes/${cakeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete cake");
      
      // Update local state
      setCakes((prev) => prev.filter((cake: any) => cake._id !== cakeId));
      alert("Cake deleted successfully");
    } catch (err: any) {
      alert(err.message || "Error deleting cake");
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update status");
      
      // Update local state
      setOrders((prev: any) =>
        prev.map((order: any) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err: any) {
      alert(err.message || "Error updating status");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCakeImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cloudinary Upload
  const uploadToCloudinary = async (file: File): Promise<string> => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to upload image to Cloudinary");
      }
      
      return data.secure_url;
    } catch (error: any) {
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCakeError("");
    setCakeSuccess("");
    setSubmittingCake(true);

    try {
      let imageUrl = imagePreview;

      if (cakeImage) {
        // 1. Upload to Cloudinary
        imageUrl = await uploadToCloudinary(cakeImage);
      } else if (!editingCakeId) {
        throw new Error("Please select an image for the cake");
      }

      // 2. Send to backend
      const token = localStorage.getItem("adminToken");
      const ingredientsArray = cakeForm.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== "");

      const payload = {
        name: cakeForm.name,
        category: cakeForm.category,
        price: parseFloat(cakeForm.price),
        sizeWeight: {
          min: parseFloat(cakeForm.minWeight),
          max: parseFloat(cakeForm.maxWeight),
        },
        ingredients: ingredientsArray,
        imageUrl: imageUrl,
        available: cakeForm.available,
      };

      const url = editingCakeId 
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cakes/${editingCakeId}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cakes`;
        
      const response = await fetch(url, {
          method: editingCakeId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.errors?.join(", ") || "Failed to add cake");

      setCakeSuccess(editingCakeId ? "Cake updated successfully!" : "Cake added successfully!");
      setEditingCakeId(null);
      // Reset form
      setCakeForm({
        name: "",
        category: "birthday",
        price: "",
        minWeight: "",
        maxWeight: "",
        ingredients: "",
        available: true,
      });
      setCakeImage(null);
      setImagePreview("");
    } catch (err: any) {
      setCakeError(err.message || "Error adding cake");
    } finally {
      setSubmittingCake(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.logo}>
          <h2>FrozT</h2>
          <span>Admin</span>
        </div>
        <nav className={styles.nav}>
          <button
            className={activeTab === "orders" ? styles.activeNav : ""}
            onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}
          >
            Orders
          </button>
          <button
            className={activeTab === "cakes" ? styles.activeNav : ""}
            onClick={() => { setActiveTab("cakes"); setIsSidebarOpen(false); }}
          >
            Cakes
          </button>
          <button
            className={activeTab === "testimonials" ? styles.activeNav : ""}
            onClick={() => { setActiveTab("testimonials"); setIsSidebarOpen(false); }}
          >
            Testimonials
          </button>
          <button
            className={activeTab === "add-cake" ? styles.activeNav : ""}
            onClick={() => { setActiveTab("add-cake"); setIsSidebarOpen(false); }}
          >
            Add Cake
          </button>
        </nav>
        <div className={styles.logoutContainer}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <button className={styles.hamburger} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
          <h1>{activeTab === "orders" ? "Manage Orders" : activeTab === "cakes" ? "Manage Cakes" : activeTab === "testimonials" ? "Customer Testimonials" : editingCakeId ? "Edit Cake" : "Add New Cake"}</h1>
          <div className={styles.userInfo}>
            <span>Welcome, Admin</span>
          </div>
        </header>

        <div className={styles.contentArea}>
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className={styles.ordersSection}>
              {/* Filter and Search Bar */}
              <div className={styles.filterBar}>
                <div className={styles.searchGroup}>
                  <input
                    type="text"
                    placeholder="Search by ID, name, phone..."
                    value={ordersSearch}
                    onChange={(e) => {
                      setOrdersSearch(e.target.value);
                      setOrdersPage(1);
                    }}
                    className={styles.searchInput}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <select
                    value={ordersStatusFilter}
                    onChange={(e) => {
                      setOrdersStatusFilter(e.target.value);
                      setOrdersPage(1);
                    }}
                    className={styles.filterSelect}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className={styles.dateInputs}>
                    <input
                      type="date"
                      value={ordersDateFrom}
                      onChange={(e) => {
                        setOrdersDateFrom(e.target.value);
                        setOrdersPage(1);
                      }}
                      className={styles.dateInput}
                      title="From Date"
                    />
                    <span className={styles.dateSeparator}>to</span>
                    <input
                      type="date"
                      value={ordersDateTo}
                      onChange={(e) => {
                        setOrdersDateTo(e.target.value);
                        setOrdersPage(1);
                      }}
                      className={styles.dateInput}
                      title="To Date"
                    />
                  </div>
                  <select
                    value={ordersPaymentFilter}
                    onChange={(e) => {
                      setOrdersPaymentFilter(e.target.value);
                      setOrdersPage(1);
                    }}
                    className={styles.filterSelect}
                  >
                    <option value="">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              {loadingOrders ? (
                <div className={styles.message}>Loading orders...</div>
              ) : ordersError ? (
                <div className={styles.errorMessage}>{ordersError}</div>
              ) : orders.length === 0 ? (
                <div className={styles.message}>No orders found matching the filter criteria.</div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: any) => (
                        <tr key={order._id}>
                          <td data-label="Order ID" className={styles.orderId}>{order.orderId}</td>
                          <td data-label="Customer">
                            <div className={styles.customerInfo}>
                              <strong>{order.customer.name}</strong>
                              <span>{order.customer.phone}</span>
                            </div>
                          </td>
                          <td data-label="Date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td data-label="Total">₹{order.totalAmount}</td>
                          <td data-label="Payment">
                            <span className={`${styles.paymentBadge} ${styles[`payment${(order.paymentStatus || 'unpaid').charAt(0).toUpperCase() + (order.paymentStatus || 'unpaid').slice(1)}`]}`}>
                              {(order.paymentStatus || 'unpaid').charAt(0).toUpperCase() + (order.paymentStatus || 'unpaid').slice(1)}
                            </span>
                            {order.paymentStatus === 'partial' && (
                              <div className={styles.paymentSubtext}>₹{order.amountPaid || 0} / ₹{order.totalAmount}</div>
                            )}
                          </td>
                          <td data-label="Status">
                            <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td data-label="Actions">
                            <div className={styles.actionsContainer}>
                              <button onClick={() => setSelectedOrder(order)} className={styles.viewBtn}>View</button>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                className={styles.statusSelect}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="delivered">Delivered</option>
                                <option value="rejected">Rejected</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <Pagination
                currentPage={ordersPage}
                totalPages={ordersTotalPages}
                onPageChange={setOrdersPage}
              />
            </div>
          )}

          {/* Cakes Tab */}
          {activeTab === "cakes" && (
            <div className={styles.cakesSection}>
              {/* Filter and Search Bar */}
              <div className={styles.filterBar}>
                <div className={styles.searchGroup}>
                  <input
                    type="text"
                    placeholder="Search cakes by name..."
                    value={cakesSearch}
                    onChange={(e) => {
                      setCakesSearch(e.target.value);
                      setCakesPage(1);
                    }}
                    className={styles.searchInput}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <select
                    value={cakesCategoryFilter}
                    onChange={(e) => {
                      setCakesCategoryFilter(e.target.value);
                      setCakesPage(1);
                    }}
                    className={styles.filterSelect}
                  >
                    <option value="">All Categories</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="photo">Photo</option>
                    <option value="cupcake">Cupcake</option>
                    <option value="fondant">Fondant</option>
                    <option value="cheesecake">Cheesecake</option>
                  </select>

                  <select
                    value={cakesAvailableFilter}
                    onChange={(e) => {
                      setCakesAvailableFilter(e.target.value);
                      setCakesPage(1);
                    }}
                    className={styles.filterSelect}
                  >
                    <option value="">All Statuses</option>
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
              </div>

              {loadingCakes ? (
                <div className={styles.message}>Loading cakes...</div>
              ) : cakesError ? (
                <div className={styles.errorMessage}>{cakesError}</div>
              ) : cakes.length === 0 ? (
                <div className={styles.message}>No cakes found matching the filter criteria.</div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cakes.map((cake: any) => (
                        <tr key={cake._id}>
                          <td data-label="Photo">
                            {cake.imageUrl && (
                              <img src={cake.imageUrl} alt={cake.name} className={styles.cakePhoto} />
                            )}
                          </td>
                          <td data-label="Name"><strong>{cake.name}</strong></td>
                          <td data-label="Category">{cake.category}</td>
                          <td data-label="Price">₹{cake.price}</td>
                          <td data-label="Status">
                            <span className={`${styles.statusBadge} ${cake.available ? styles.confirmed : styles.rejected}`}>
                              {cake.available ? "Available" : "Unavailable"}
                            </span>
                          </td>
                          <td data-label="Actions">
                            <div className={styles.actionsContainer}>
                              <button
                                onClick={() => handleToggleAvailability(cake._id)}
                                className={`${styles.statusToggleBtn} ${cake.available ? styles.btnMakeUnavailable : styles.btnMakeAvailable}`}
                              >
                                {cake.available ? "Disable" : "Enable"}
                              </button>
                              <button onClick={() => handleEditClick(cake)} className={styles.editBtn}>Edit</button>
                              <button onClick={() => handleDeleteClick(cake._id)} className={styles.deleteBtn}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <Pagination
                currentPage={cakesPage}
                totalPages={cakesTotalPages}
                onPageChange={setCakesPage}
              />
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === "testimonials" && (
            <div className={styles.cakesSection}>
              {loadingFeedbacks ? (
                <div className={styles.message}>Loading testimonials...</div>
              ) : feedbacksError ? (
                <div className={styles.errorMessage}>{feedbacksError}</div>
              ) : feedbacks.length === 0 ? (
                <div className={styles.message}>No testimonials found.</div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Reviewer Name</th>
                        <th>Rating</th>
                        <th>Feedback / Comment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((item: any) => (
                        <tr key={item._id}>
                          <td data-label="Date">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td data-label="Reviewer Name">
                            <strong>{item.name}</strong>
                          </td>
                          <td data-label="Rating">
                            <div className={styles.adminRatingStars}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={i < item.rating ? styles.filledStar : styles.emptyStar}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </td>
                          <td data-label="Feedback" className={styles.feedbackTextCell}>
                            "{item.feedback}"
                          </td>
                          <td data-label="Actions">
                            <div className={styles.actionsContainer}>
                              <button
                                onClick={() => handleDeleteFeedback(item._id)}
                                className={styles.deleteBtn}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Add Cake Tab */}
          {activeTab === "add-cake" && (
            <div className={styles.formSection}>
              <form onSubmit={handleCakeSubmit} className={styles.form}>
                {cakeError && <div className={styles.errorMessage}>{cakeError}</div>}
                {cakeSuccess && <div className={styles.successMessage}>{cakeSuccess}</div>}

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="name">Cake Name</label>
                    <input
                      type="text"
                      id="name"
                      value={cakeForm.name}
                      onChange={(e) => setCakeForm({ ...cakeForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={cakeForm.category}
                      onChange={(e) => setCakeForm({ ...cakeForm, category: e.target.value })}
                      required
                    >
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="photo">Photo</option>
                      <option value="cupcake">Cupcake</option>
                      <option value="fondant">Fondant</option>
                      <option value="cheesecake">Cheesecake</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="price">Price (₹)</label>
                    <input
                      type="number"
                      id="price"
                      value={cakeForm.price}
                      onChange={(e) => setCakeForm({ ...cakeForm, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="minWeight">Min Weight (kg)</label>
                    <input
                      type="number"
                      id="minWeight"
                      step="0.5"
                      value={cakeForm.minWeight}
                      onChange={(e) => setCakeForm({ ...cakeForm, minWeight: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="maxWeight">Max Weight (kg)</label>
                    <input
                      type="number"
                      id="maxWeight"
                      step="0.5"
                      value={cakeForm.maxWeight}
                      onChange={(e) => setCakeForm({ ...cakeForm, maxWeight: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="ingredients">Ingredients (comma separated)</label>
                    <input
                      type="text"
                      id="ingredients"
                      value={cakeForm.ingredients}
                      onChange={(e) => setCakeForm({ ...cakeForm, ingredients: e.target.value })}
                      placeholder="Flour, Sugar, Butter..."
                      required
                    />
                  </div>

                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="available"
                      checked={cakeForm.available}
                      onChange={(e) => setCakeForm({ ...cakeForm, available: e.target.checked })}
                      className={styles.checkboxInput}
                    />
                    <label htmlFor="available" className={styles.checkboxLabel}>Available for Ordering</label>
                  </div>
                </div>

                {/* File Upload */}
                <div className={styles.uploadGroup}>
                  <label>Cake Photo</label>
                  <div className={styles.uploadArea}>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={styles.fileInput}
                    />
                    <label htmlFor="image" className={styles.fileLabel}>
                      {imagePreview ? "Change Photo" : "Choose Photo"}
                    </label>
                    {imagePreview && (
                      <div className={styles.previewContainer}>
                        <img src={imagePreview} alt="Preview" className={styles.preview} />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={uploadingImage || submittingCake}
                >
                  {uploadingImage
                    ? "Uploading Image..."
                    : submittingCake
                    ? "Saving Cake..."
                    : editingCakeId ? "Update Cake" : "Add Cake"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      {/* Order Detail Modal */}
      {selectedOrder && typeof document !== 'undefined' && createPortal(
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Order Details: {selectedOrder.orderId}</h2>
              <button onClick={() => setSelectedOrder(null)} className={styles.modalCloseBtn}>×</button>
            </div>
            
            <div className={styles.modalGrid}>
              <div className={styles.modalInfoGroup}>
                <h3>Customer Info</h3>
                <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                <p><strong>Email:</strong> {selectedOrder.customer.email || 'N/A'}</p>
              </div>
              
              <div className={styles.modalInfoGroup}>
                <h3>Delivery Info</h3>
                <p><strong>Address:</strong> {selectedOrder.delivery?.address || 'N/A'}</p>
                <p><strong>City:</strong> {selectedOrder.delivery?.city || 'N/A'}</p>
                <p><strong>Pincode:</strong> {selectedOrder.delivery?.pincode || 'N/A'}</p>
                <p><strong>Date:</strong> {selectedOrder.delivery?.date ? new Date(selectedOrder.delivery.date).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Time Slot:</strong> {selectedOrder.delivery?.timeSlot || 'N/A'}</p>
              </div>
            </div>
            
            <div className={styles.modalItemsSection}>
              <h3>Items</h3>
              <div className={styles.modalTableWrapper}>
                <table className={styles.modalTable}>
                  <thead>
                    <tr>
                      <th>Cake</th>
                      <th>Qty</th>
                      <th>Size</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td data-label="Cake">{item.cake?.name || 'Unknown Cake'}</td>
                        <td data-label="Qty">{item.quantity}</td>
                        <td data-label="Size">{item.size} kg</td>
                        <td data-label="Message">{item.message || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Payment Section */}
            <div className={styles.paymentSection}>
              <h3>Payment</h3>
              <div className={styles.paymentSummary}>
                <div className={styles.paymentCard}>
                  <span className={styles.paymentCardLabel}>Total</span>
                  <span className={styles.paymentCardValue}>₹{selectedOrder.totalAmount}</span>
                </div>
                <div className={styles.paymentCard}>
                  <span className={styles.paymentCardLabel}>Paid</span>
                  <span className={styles.paymentCardValue}>₹{selectedOrder.amountPaid || 0}</span>
                </div>
                <div className={styles.paymentCard}>
                  <span className={styles.paymentCardLabel}>Balance</span>
                  <span className={styles.paymentCardValue}>₹{selectedOrder.totalAmount - (selectedOrder.amountPaid || 0)}</span>
                </div>
              </div>
              <div className={styles.paymentProgressWrap}>
                <div
                  className={styles.paymentProgressBar}
                  style={{ width: `${Math.min(100, Math.round(((selectedOrder.amountPaid || 0) / selectedOrder.totalAmount) * 100))}%` }}
                />
              </div>

              {/* Payment History */}
              {selectedOrder.payments && selectedOrder.payments.length > 0 && (
                <div className={styles.paymentTimeline}>
                  {[...selectedOrder.payments].reverse().map((p: any) => (
                    <div key={p._id} className={styles.paymentEntry}>
                      <div className={styles.paymentEntryDot} />
                      <div className={styles.paymentEntryContent}>
                        <div className={styles.paymentEntryTop}>
                          <strong>₹{p.amount}</strong>
                          <span className={styles.paymentMethod}>{(p.method || 'cash').replace('_', ' ')}</span>
                          <button
                            onClick={() => handleRemovePayment(selectedOrder._id, p._id)}
                            className={styles.removePaymentBtn}
                            title="Remove payment"
                          >
                            🗑
                          </button>
                        </div>
                        {p.note && <div className={styles.paymentNote}>{p.note}</div>}
                        <div className={styles.paymentDate}>{new Date(p.paidAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Payment Form */}
              {(selectedOrder.totalAmount - (selectedOrder.amountPaid || 0)) > 0 && (
                <form
                  className={styles.paymentForm}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const amount = parseFloat((form.elements.namedItem('payAmount') as HTMLInputElement).value);
                    const method = (form.elements.namedItem('payMethod') as HTMLSelectElement).value;
                    const note = (form.elements.namedItem('payNote') as HTMLInputElement).value;
                    if (!amount || amount <= 0) return;
                    const success = await handleAddPayment(selectedOrder._id, amount, method, note);
                    if (success) form.reset();
                  }}
                >
                  <input
                    type="number"
                    name="payAmount"
                    placeholder="Amount"
                    min="1"
                    max={selectedOrder.totalAmount - (selectedOrder.amountPaid || 0)}
                    step="any"
                    required
                    className={styles.paymentInput}
                  />
                  <select name="payMethod" className={styles.paymentMethodSelect}>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="payNote"
                    placeholder="Note (optional)"
                    className={styles.paymentInput}
                  />
                  <button type="submit" className={styles.recordPaymentBtn}>
                    + Record
                  </button>
                </form>
              )}
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalStatusUpdate}>
                <strong>Status:</strong>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    handleStatusUpdate(selectedOrder._id, newStatus);
                    setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : null);
                  }}
                  className={styles.statusSelect}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className={styles.modalTotal}>
                Total: ₹{selectedOrder.totalAmount}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
