'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    tl.fromTo(headingRef.current, 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    tl.fromTo(textRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );

    if (highlightsRef.current) {
      tl.fromTo(highlightsRef.current.children, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        '-=0.3'
      );
    }

    tl.fromTo(imageRef.current, 
      { opacity: 0, scale: 0.9 }, 
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );

  }, []);

  return (
    <section id="about" ref={sectionRef} className={styles.about}>
      <div className={`container ${styles.container}`}>
        <div className={styles.imageWrapper} ref={imageRef}>
          <div className={styles.photoFrame}>
            <div className={styles.placeholderImage}>
              <span>Cake Photo</span>
            </div>
          </div>
        </div>
        
        <div className={styles.content}>
          <h2 ref={headingRef} className={styles.heading}>Our Story</h2>
          <p ref={textRef} className={styles.paragraph}>
            Cake Gallery was born from a passion for baking and a love of beautiful things. 
            Every cake is made from scratch, with the finest ingredients and an artist's eye for detail.
          </p>
          
          <div ref={highlightsRef} className={styles.highlights}>
            <div className={styles.highlight}>
              <span className={styles.icon}>🥚</span>
              <div>
                <h3>Fresh Daily</h3>
                <p>Made from scratch every day.</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.icon}>🎨</span>
              <div>
                <h3>Custom Designs</h3>
                <p>Tailored to your vision.</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.icon}>❤️</span>
              <div>
                <h3>Made with Love</h3>
                <p>Passion in every bite.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
