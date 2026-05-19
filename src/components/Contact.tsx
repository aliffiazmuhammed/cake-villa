'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Contact.module.css';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // GSAP animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (formRef.current && infoRef.current) {
      gsap.fromTo(formRef.current, 
        { opacity: 0, x: -50 }, 
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          }
        }
      );

      gsap.fromTo(infoRef.current, 
        { opacity: 0, x: 50 }, 
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          }
        }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT VALIDATION: Name, Rating, and Feedback must all be shared/provided!
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (rating === 0) {
      setError("Please select a star rating (1 to 5).");
      return;
    }
    if (!feedbackText.trim()) {
      setError("Please share your feedback text.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            rating,
            feedback: feedbackText.trim(),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      setSuccess(true);
      
      // Clear form
      setName("");
      setRating(0);
      setHoverRating(0);
      setFeedbackText("");

      // Hide success notification after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Error submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className={styles.contact}>
      <div className="container">
        <h2 className={styles.heading}>We Value Your Feedback</h2>
        
        <div className={styles.wrapper}>
          {/* Feedback Form */}
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <h3>Share Your Experience</h3>
            <p className={styles.formSubtitle}>Let us know how you liked our cakes and service!</p>

            {error && <div className={styles.errorAlert}>⚠️ {error}</div>}
            {success && <div className={styles.successAlert}>🎉 Thank you! Your feedback has been shared.</div>}

            <div className={styles.formGroup}>
              <label htmlFor="feedbackName">Name *</label>
              <input
                type="text"
                id="feedbackName"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error && e.target.value.trim()) setError("");
                }}
                required
                className={styles.inputField}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Rating *</label>
              <div className={styles.starRatingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.starBtn} ${
                      star <= (hoverRating || rating) ? styles.activeStar : ""
                    }`}
                    onClick={() => {
                      setRating(star);
                      if (error) setError("");
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} Stars`}
                  >
                    ★
                  </button>
                ))}
                <span className={styles.ratingLabel}>
                  {rating > 0 ? `${rating} / 5 Stars` : "Select a rating"}
                </span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="feedbackContent">Your Feedback *</label>
              <textarea
                id="feedbackContent"
                rows={4}
                placeholder="Tell us about the flavor, decoration, or overall service..."
                value={feedbackText}
                onChange={(e) => {
                  setFeedbackText(e.target.value);
                  if (error && e.target.value.trim()) setError("");
                }}
                required
                className={styles.textareaField}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`btn btn-primary ${styles.submitBtn}`}
            >
              {submitting ? "Sharing Feedback..." : "Submit Feedback"}
            </button>
          </form>
          
          {/* Contact details */}
          <div ref={infoRef} className={styles.info}>
            <h3>Contact Info</h3>
            
            <div className={styles.infoItem}>
              <span className={styles.icon}>📞</span>
              <div>
                <p className={styles.label}>Phone / WhatsApp</p>
                <p className={styles.value}>+91 9876543210</p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.icon}>📍</span>
              <div>
                <p className={styles.label}>Location</p>
                <p className={styles.value}>Kerala, India</p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.icon}>📸</span>
              <div>
                <p className={styles.label}>Instagram</p>
                <p className={styles.value}>@cakegallery</p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.icon}>🕒</span>
              <div>
                <p className={styles.label}>Hours</p>
                <p className={styles.value}>9:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
