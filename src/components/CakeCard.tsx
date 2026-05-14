'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './CakeCard.module.css';

interface CakeCardProps {
  cake: {
    _id: string;
    name: string;
    category: string;
    price: number;
    sizeWeight: { min: number; max: number };
    ingredients: string[];
    imageUrl: string;
  };
}

export default function CakeCard({ cake }: CakeCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    city: "",
    pincode: "",
    date: "",
    timeSlot: "Standard Delivery (9 AM - 9 PM)",
    quantity: "1",
    weight: cake.sizeWeight.min.toString(),
    message: "",
  });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        customer: {
          name: orderForm.customerName,
          email: orderForm.customerEmail,
          phone: orderForm.customerPhone,
        },
        delivery: {
          address: orderForm.customerAddress,
          city: orderForm.city,
          pincode: orderForm.pincode,
          date: orderForm.date,
          timeSlot: orderForm.timeSlot,
        },
        items: [
          {
            cake: cake._id,
            quantity: parseInt(orderForm.quantity),
            size: parseFloat(orderForm.weight), // Backend expects 'size'
            message: orderForm.message,
          },
        ],
        totalAmount: cake.price * parseInt(orderForm.quantity),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to place order");

      setSuccess(true);
      // Reset form
      setOrderForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        city: "",
        pincode: "",
        date: "",
        timeSlot: "Standard Delivery (9 AM - 9 PM)",
        quantity: "1",
        weight: cake.sizeWeight.min.toString(),
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Error placing order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imagePlaceholder}>
        {cake.imageUrl ? (
          <img src={cake.imageUrl} alt={cake.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span>🎂</span>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{cake.name}</h3>
          <span className={styles.price}>₹{cake.price}</span>
        </div>
        <div className={styles.meta}>
          <span className={styles.category}>{cake.category}</span>
          <span className={styles.size}>
            {cake.sizeWeight.min} - {cake.sizeWeight.max} kg
          </span>
        </div>
        <div className={styles.ingredients}>
          <strong>Ingredients:</strong> {cake.ingredients.join(', ')}
        </div>
        <button className={`btn btn-secondary ${styles.btn}`} onClick={() => setShowModal(true)}>
          Buy Now
        </button>
      </div>

      {/* Order Modal using Portal */}
      {showModal && typeof document !== 'undefined' && createPortal(
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
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Order {cake.name}</h2>
            
            {success ? (
              <div style={{ color: 'green', marginBottom: '1rem' }}>
                🎉 Order placed successfully! We will contact you soon.
                <button onClick={() => setShowModal(false)} style={{ display: 'block', marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ccc', background: 'none' }}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit}>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                  <input type="text" value={orderForm.customerName} onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                  <input type="email" value={orderForm.customerEmail} onChange={(e) => setOrderForm({...orderForm, customerEmail: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                  <input type="tel" value={orderForm.customerPhone} onChange={(e) => setOrderForm({...orderForm, customerPhone: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Address</label>
                  <textarea value={orderForm.customerAddress} onChange={(e) => setOrderForm({...orderForm, customerAddress: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>City</label>
                    <input type="text" value={orderForm.city} onChange={(e) => setOrderForm({...orderForm, city: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Pincode</label>
                    <input type="text" value={orderForm.pincode} onChange={(e) => setOrderForm({...orderForm, pincode: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Delivery Date</label>
                    <input type="date" value={orderForm.date} onChange={(e) => setOrderForm({...orderForm, date: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Time Slot</label>
                    <select value={orderForm.timeSlot} onChange={(e) => setOrderForm({...orderForm, timeSlot: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}>
                      <option value="Standard Delivery (9 AM - 9 PM)">Standard Delivery (9 AM - 9 PM)</option>
                      <option value="Morning Delivery (8 AM - 12 PM)">Morning Delivery (8 AM - 12 PM)</option>
                      <option value="Afternoon Delivery (12 PM - 4 PM)">Afternoon Delivery (12 PM - 4 PM)</option>
                      <option value="Evening Delivery (4 PM - 8 PM)">Evening Delivery (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
                    <input type="number" min="1" value={orderForm.quantity} onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Weight (kg)</label>
                    <input type="number" min={cake.sizeWeight.min} max={cake.sizeWeight.max} step="0.5" value={orderForm.weight} onChange={(e) => setOrderForm({...orderForm, weight: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Message (Optional)</label>
                  <input type="text" value={orderForm.message} onChange={(e) => setOrderForm({...orderForm, message: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Total: ₹{cake.price * parseInt(orderForm.quantity || "0")}</span>
                  <div>
                    <button type="button" onClick={() => setShowModal(false)} style={{ marginRight: '1rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ccc', background: 'none' }}>Cancel</button>
                    <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'var(--foreground)', fontWeight: 'bold' }}>
                      {submitting ? "Placing Order..." : "Confirm Order"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
