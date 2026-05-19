'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Testimonials.module.css';

interface TestimonialItem {
  name: string;
  occasion: string;
  text: string;
  rating: number;
}

const fallbackTestimonials: TestimonialItem[] = [
  { name: 'Priya R.', occasion: 'Wedding Cake Client', text: 'The wedding cake was beyond our expectations — looked like art, tasted even better!', rating: 5 },
  { name: 'Anita M.', occasion: 'Birthday Cake Client', text: 'Ordered a custom fondant cake for my son\'s 5th birthday. He was over the moon!', rating: 5 },
  { name: 'Rahul K.', occasion: 'Cheesecake Lover', text: 'Best cheesecake I\'ve ever had. Super fresh and on-time delivery.', rating: 5 },
  { name: 'Sreelakshmi T.', occasion: 'Photo Cake Client', text: 'Beautiful photo cake for my mom\'s anniversary. Highly recommend!', rating: 5 },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch 5-star feedbacks on mount
  useEffect(() => {
    const fetch5StarReviews = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/feedback?rating=5&limit=4`
        );
        const data = await response.json();
        if (response.ok && data.data && data.data.length > 0) {
          const mapped: TestimonialItem[] = data.data.map((item: any) => ({
            name: item.name,
            occasion: 'Verified Buyer',
            text: item.feedback,
            rating: item.rating || 5,
          }));
          setReviews(mapped);
        } else {
          setReviews(fallbackTestimonials);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setReviews(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetch5StarReviews();
  }, []);

  // GSAP animation triggered AFTER reviews are loaded and rendered
  useEffect(() => {
    if (loading || reviews.length === 0) return;

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
  }, [loading, reviews]);

  return (
    <section id="testimonials" ref={sectionRef} className={styles.testimonials}>
      <div className="container">
        <h2 className={styles.heading}>What Our Customers Say</h2>
        
        <div ref={cardsRef} className={styles.cards}>
          {reviews.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.stars}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <p className={styles.text}>"{item.text}"</p>
              <div className={styles.author}>
                <span className={styles.name}>{item.name.toUpperCase()}</span>
                <span className={styles.occasion}>{item.occasion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
