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

    // Client-side validations
    const nameTrimmed = orderForm.customerName.trim();
    if (!nameTrimmed) {
      setError("Name is required.");
      setSubmitting(false);
      return;
    }
    const nameCaps = nameTrimmed.toUpperCase();

    const emailTrimmed = orderForm.customerEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setError("Please enter a valid email address.");
      setSubmitting(false);
      return;
    }

    const phoneTrimmed = orderForm.customerPhone.trim();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneTrimmed)) {
      setError("Phone number must be exactly 10 digits.");
      setSubmitting(false);
      return;
    }

    const pincodeTrimmed = orderForm.pincode.trim();
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincodeTrimmed)) {
      setError("Pincode must be exactly 6 digits.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        customer: {
          name: nameCaps,
          email: emailTrimmed,
          phone: phoneTrimmed,
        },
        delivery: {
          address: orderForm.customerAddress,
          city: orderForm.city,
          pincode: pincodeTrimmed,
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
          <img src={cake.imageUrl} alt={cake.name} style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff' }} />
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
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Order {cake.name}</h2>
            
            {success ? (
              <div className={styles.successAlert}>
                🎉 Order placed successfully! We will contact you soon.
                <button onClick={() => setShowModal(false)} className={styles.cancelBtn} style={{ display: 'block', margin: '1.5rem auto 0' }}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit}>
                {error && (
                  <div className={styles.errorAlert}>
                    ⚠️ {error}
                  </div>
                )}
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})}
                    required
                    className={styles.inputField}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={orderForm.customerEmail}
                    onChange={(e) => setOrderForm({...orderForm, customerEmail: e.target.value})}
                    required
                    className={styles.inputField}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone *</label>
                  <input
                    type="tel"
                    placeholder="10-digit phone number"
                    maxLength={10}
                    pattern="\d{10}"
                    title="Phone number must be exactly 10 digits"
                    value={orderForm.customerPhone}
                    onChange={(e) => setOrderForm({...orderForm, customerPhone: e.target.value.replace(/\D/g, '')})}
                    required
                    className={styles.inputField}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Address</label>
                  <textarea
                    placeholder="Enter delivery address"
                    value={orderForm.customerAddress}
                    onChange={(e) => setOrderForm({...orderForm, customerAddress: e.target.value})}
                    required
                    className={styles.textareaField}
                  />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <label className={styles.label}>City</label>
                    <input
                      type="text"
                      placeholder="City name"
                      value={orderForm.city}
                      onChange={(e) => setOrderForm({...orderForm, city: e.target.value})}
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formCol}>
                    <label className={styles.label}>Pincode *</label>
                    <input
                      type="text"
                      placeholder="6-digit pincode"
                      maxLength={6}
                      pattern="\d{6}"
                      title="Pincode must be exactly 6 digits"
                      value={orderForm.pincode}
                      onChange={(e) => setOrderForm({...orderForm, pincode: e.target.value.replace(/\D/g, '')})}
                      required
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <label className={styles.label}>Delivery Date</label>
                    <input
                      type="date"
                      value={orderForm.date}
                      onChange={(e) => setOrderForm({...orderForm, date: e.target.value})}
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formCol}>
                    <label className={styles.label}>Time Slot</label>
                    <select
                      value={orderForm.timeSlot}
                      onChange={(e) => setOrderForm({...orderForm, timeSlot: e.target.value})}
                      required
                      className={styles.selectField}
                    >
                      <option value="Standard Delivery (9 AM - 9 PM)">Standard Delivery (9 AM - 9 PM)</option>
                      <option value="Morning Delivery (8 AM - 12 PM)">Morning Delivery (8 AM - 12 PM)</option>
                      <option value="Afternoon Delivery (12 PM - 4 PM)">Afternoon Delivery (12 PM - 4 PM)</option>
                      <option value="Evening Delivery (4 PM - 8 PM)">Evening Delivery (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <label className={styles.label}>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
                      required
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formCol}>
                    <label className={styles.label}>Weight (kg)</label>
                    <input
                      type="number"
                      min={cake.sizeWeight.min}
                      max={cake.sizeWeight.max}
                      step="0.5"
                      value={orderForm.weight}
                      onChange={(e) => setOrderForm({...orderForm, weight: e.target.value})}
                      required
                      className={styles.inputField}
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Message (Optional)</label>
                  <input
                    type="text"
                    placeholder="E.g. Happy Birthday John!"
                    value={orderForm.message}
                    onChange={(e) => setOrderForm({...orderForm, message: e.target.value})}
                    className={styles.inputField}
                  />
                </div>
                
                <div className={styles.modalFooter}>
                  <div className={styles.modalTotal}>
                    Total: <span>₹{cake.price * parseInt(orderForm.quantity || "0")}</span>
                  </div>
                  <div className={styles.btnActions}>
                    <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting} className={styles.confirmBtn}>
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
