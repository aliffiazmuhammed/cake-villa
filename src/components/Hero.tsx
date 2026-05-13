'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Hero.module.css';

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Staggered word-by-word fade-up
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('span');
      tl.fromTo(words, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }

    // Subheadline fade in
    tl.fromTo(subheadlineRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.2'
    );

    // CTA buttons stagger
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current.children, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        '-=0.3'
      );
    }

    // Badges drift in
    if (badgesRef.current) {
      tl.fromTo(badgesRef.current.children,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.7)' },
        '-=0.2'
      );
    }

  }, []);

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.blob}></div>
      <div className={styles.blob2}></div>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <h1 ref={headlineRef} className={styles.headline}>
            <span>Where</span> <span>Every</span> <span>Cake</span> <span>Tells</span> <span>a</span> <span>Story</span>
          </h1>
          <p ref={subheadlineRef} className={styles.subheadline}>
            Handcrafted custom cakes for your most precious moments — weddings, birthdays, and celebrations.
          </p>
          <div ref={ctaRef} className={styles.cta}>
            <button className="btn btn-primary">Explore Our Cakes</button>
            <button className="btn btn-outline">Get a Custom Quote</button>
          </div>
          
          <div ref={badgesRef} className={styles.badges}>
            <span className={styles.badge}>✨ 100% Fresh Ingredients</span>
            <span className={styles.badge}>🎂 Custom Orders Welcome</span>
            <span className={styles.badge}>🚚 Delivered with Love</span>
          </div>
        </div>
      </div>
    </section>
  );
}
