'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Contact.module.css';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="contact" ref={sectionRef} className={styles.contact}>
      <div className="container">
        <h2 className={styles.heading}>Ready to Order Your Dream Cake?</h2>
        
        <div className={styles.wrapper}>
          <form ref={formRef} className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your Name" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" placeholder="Your Phone" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="occasion">Occasion</label>
              <input type="text" id="occasion" placeholder="Wedding, Birthday, etc." />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cakeType">Cake Type</label>
              <select id="cakeType">
                <option value="">Select Cake Type</option>
                <option value="wedding">Wedding Cake</option>
                <option value="birthday">Birthday Cake</option>
                <option value="photo">Photo Cake</option>
                <option value="cupcake">Cupcake Tower</option>
                <option value="fondant">Fondant Cake</option>
                <option value="cheesecake">Cheesecake</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea id="message" rows={4} placeholder="Tell us about your dream cake..."></textarea>
            </div>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
              Submit Order
            </button>
          </form>
          
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
