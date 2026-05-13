'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Testimonials.module.css';

const testimonials = [
  { name: 'Priya R.', occasion: 'Wedding', text: 'The wedding cake was beyond our expectations — looked like art, tasted even better!' },
  { name: 'Anita M.', occasion: 'Birthday', text: 'Ordered a custom fondant cake for my son\'s 5th birthday. He was over the moon!' },
  { name: 'Rahul K.', occasion: 'Anniversary', text: 'Best cheesecake I\'ve ever had. Super fresh and on-time delivery.' },
  { name: 'Sreelakshmi T.', occasion: 'Anniversary', text: 'Beautiful photo cake for my mom\'s anniversary. Highly recommend!' },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(`.${styles.card}`);
      
      gsap.fromTo(cards, 
        { opacity: 0, x: 100, rotation: 5 }, 
        { 
          opacity: 1, 
          x: 0, 
          rotation: (i) => (i % 2 === 0 ? -1 : 1), 
          duration: 0.8, 
          stagger: 0.2, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          }
        }
      );

      // Animate stars
      const stars = cardsRef.current.querySelectorAll(`.${styles.stars} span`);
      gsap.fromTo(stars,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none none',
          }
        }
      );
    }
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className={styles.testimonials}>
      <div className="container">
        <h2 className={styles.heading}>What Our Customers Say</h2>
        
        <div ref={cardsRef} className={styles.cards}>
          {testimonials.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.stars}>
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
              <p className={styles.text}>"{item.text}"</p>
              <div className={styles.author}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.occasion}>{item.occasion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
