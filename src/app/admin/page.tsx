"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import styles from "./admin.module.css";

// Placeholders for Cloudinary
const CLOUDINARY_CLOUD_NAME = "dswcxuvoi";
const CLOUDINARY_UPLOAD_PRESET = "wl2f9b3m";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  
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
    }
  }, [activeTab, router]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrdersError("");
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch orders");
      setOrders(data.data);
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cakes`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch cakes");
      setCakes(data.data);
    } catch (err: any) {
      setCakesError(err.message || "Error fetching cakes");
    } finally {
      setLoadingCakes(false);
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
          <h1>{activeTab === "orders" ? "Manage Orders" : activeTab === "cakes" ? "Manage Cakes" : editingCakeId ? "Edit Cake" : "Add New Cake"}</h1>
          <div className={styles.userInfo}>
            <span>Welcome, Admin</span>
          </div>
        </header>

        <div className={styles.contentArea}>
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className={styles.ordersSection}>
              {loadingOrders ? (
                <div className={styles.message}>Loading orders...</div>
              ) : ordersError ? (
                <div className={styles.errorMessage}>{ordersError}</div>
              ) : orders.length === 0 ? (
                <div className={styles.message}>No orders found.</div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: any) => (
                        <tr key={order._id}>
                          <td className={styles.orderId}>{order.orderId}</td>
                          <td>
                            <div className={styles.customerInfo}>
                              <strong>{order.customer.name}</strong>
                              <span>{order.customer.phone}</span>
                            </div>
                          </td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>₹{order.totalAmount}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button onClick={() => setSelectedOrder(order)} style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: '#f0f0f0', cursor: 'pointer' }}>View</button>
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Cakes Tab */}
          {activeTab === "cakes" && (
            <div className={styles.cakesSection}>
              {loadingCakes ? (
                <div className={styles.message}>Loading cakes...</div>
              ) : cakesError ? (
                <div className={styles.errorMessage}>{cakesError}</div>
              ) : cakes.length === 0 ? (
                <div className={styles.message}>No cakes found.</div>
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
                          <td>
                            {cake.imageUrl && (
                              <img src={cake.imageUrl} alt={cake.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                            )}
                          </td>
                          <td><strong>{cake.name}</strong></td>
                          <td>{cake.category}</td>
                          <td>₹{cake.price}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${cake.available ? styles.confirmed : styles.rejected}`}>
                              {cake.available ? "Available" : "Unavailable"}
                            </span>
                          </td>
                          <td>
                            <button onClick={() => handleEditClick(cake)} style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: '#f0f0f0', cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => handleDeleteClick(cake._id)} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #ffcdd2', background: '#ffebee', color: '#c62828', cursor: 'pointer' }}>Delete</button>
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
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Order Details: {selectedOrder.orderId}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#888' }}>Customer Info</h3>
                <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                <p><strong>Email:</strong> {selectedOrder.customer.email || 'N/A'}</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#888' }}>Delivery Info</h3>
                <p><strong>Address:</strong> {selectedOrder.delivery?.address || 'N/A'}</p>
                <p><strong>City:</strong> {selectedOrder.delivery?.city || 'N/A'}</p>
                <p><strong>Pincode:</strong> {selectedOrder.delivery?.pincode || 'N/A'}</p>
                <p><strong>Date:</strong> {selectedOrder.delivery?.date ? new Date(selectedOrder.delivery.date).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Time Slot:</strong> {selectedOrder.delivery?.timeSlot || 'N/A'}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#888' }}>Items</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Cake</th>
                    <th style={{ padding: '0.5rem' }}>Qty</th>
                    <th style={{ padding: '0.5rem' }}>Size</th>
                    <th style={{ padding: '0.5rem' }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item: any, index: number) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '0.5rem' }}>{item.cake?.name || 'Unknown Cake'}</td>
                      <td style={{ padding: '0.5rem' }}>{item.quantity}</td>
                      <td style={{ padding: '0.5rem' }}>{item.size} kg</td>
                      <td style={{ padding: '0.5rem' }}>{item.message || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Status:</strong> {selectedOrder.status}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
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
