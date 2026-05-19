'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import styles from './Collection.module.css';

const categories = [
  { title: 'Wedding Cakes', desc: 'Multi-tiered masterpieces for your big day', icon: '👰', slug: 'wedding' },
  { title: 'Birthday Cakes', desc: 'Custom designs for every age and personality', icon: '🎂', slug: 'birthday' },
  { title: 'Photo Cakes', desc: 'Edible photo prints on premium sponge', icon: '📸', slug: 'photo' },
  { title: 'Cupcake Towers', desc: 'Perfect for parties and events', icon: '🧁', slug: 'cupcake' },
  { title: 'Fondant Cakes', desc: 'Sculpted art you can eat', icon: '🎨', slug: 'fondant' },
  { title: 'Cheesecakes', desc: 'Light, creamy, irresistible', icon: '🍰', slug: 'cheesecake' },
];

export default function Collection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (gridRef.current) {
      gsap.fromTo(gridRef.current.children, 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.08, 
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
    <section id="collection" ref={sectionRef} className={styles.collection}>
      <div className="container">
        <h2 className={styles.heading}>Our Cake Collection</h2>
        <p className={styles.subheading}>Explore our most popular categories</p>
        
        <div ref={gridRef} className={styles.grid}>
          {categories.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardImage}>
                <div className={styles.iconWrapper}>
                  <span className={styles.cardIcon}>{item.icon}</span>
                </div>
                <div className={styles.shimmer}></div>
              </div>
              <div className={styles.cardContent}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <Link href={`/cakes?category=${item.slug}`} className={styles.exploreBtn}>
                  Explore <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
