'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.logoSection}>
          <h2 className={styles.logo}>FrozT</h2>
          <p className={styles.tagline}>#cakeiteasy</p>
        </div>
        
        <div className={styles.linksSection}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/#home">Home</Link></li>
            <li><Link href="/#collection">Our Cakes</Link></li>
            <li><Link href="/#about">About</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className={styles.socialSection}>
          <h3>Follow Us</h3>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="WhatsApp">💬</a>
          </div>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <p>&copy; 2026 FrozT. All rights reserved.</p>
      </div>
      
      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/919876543210" className={styles.whatsappFloat} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <span>💬</span>
      </a>
    </footer>
  );
}
