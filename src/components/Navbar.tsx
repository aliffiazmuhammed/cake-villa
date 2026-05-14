'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo-cropped.png" alt="FrozT Logo" width={120} height={40} style={{ objectFit: 'contain' }} />
        </Link>
        
        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/cakes">Our Cakes</Link></li>
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/#testimonials">Testimonials</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
        
        <div className={styles.navActions}>
          <button className="btn btn-primary">
            Order Now
          </button>
          
          {/* Hamburger Button */}
          <button 
            className={styles.hamburger} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${isMenuOpen ? styles.bar1 : ''}`}></span>
            <span className={`${styles.bar} ${isMenuOpen ? styles.bar2 : ''}`}></span>
            <span className={`${styles.bar} ${isMenuOpen ? styles.bar3 : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link href="/cakes" onClick={() => setIsMenuOpen(false)}>Our Cakes</Link></li>
          <li><Link href="/#about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
          <li><Link href="/#testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</Link></li>
          <li><Link href="/#contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          <li>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Order Now
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
