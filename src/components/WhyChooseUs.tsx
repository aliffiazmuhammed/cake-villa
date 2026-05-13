'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './WhyChooseUs.module.css';

const features = [
  { icon: '🎂', title: '100% Homemade', desc: 'Baked with love and care.' },
  { icon: '🚚', title: 'Doorstep Delivery', desc: 'Fresh to your door.' },
  { icon: '📱', title: 'Easy Orders', desc: 'Via WhatsApp or Call.' },
  { icon: '⭐', title: '5-Star Rated', desc: 'By our amazing customers.' },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (gridRef.current) {
      const icons = gridRef.current.querySelectorAll(`.${styles.icon}`);
      
      gsap.fromTo(icons, 
        { opacity: 0, scale: 0 }, 
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.15, 
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          }
        }
      );
    }
  }, []);

  return (
    <section id="why-us" ref={sectionRef} className={styles.whyUs}>
      <div className="container">
        <h2 className={styles.heading}>Why Choose Us</h2>
        
        <div ref={gridRef} className={styles.grid}>
          {features.map((item, index) => (
            <div key={index} className={styles.feature}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{item.icon}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
