'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CakeCard from "../../components/CakeCard";
import styles from "./cakes.module.css";

const categories = ['all', 'wedding', 'birthday', 'photo', 'cupcake', 'fondant', 'cheesecake'];

function CakesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/cakes`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch cakes");
        setCakes(data.data);
      } catch (err: any) {
        setError(err.message || "Error fetching cakes");
      } finally {
        setLoading(false);
      }
    };
    fetchCakes();
  }, []);

  const filteredCakes = selectedCategory === 'all' 
    ? cakes 
    : cakes.filter((cake: any) => cake.category === selectedCategory);

  return (
    <main className={styles.main}>
      <div className="container">
        <h1 className={styles.title}>Our Cake Collection</h1>
        <p className={styles.subtitle}>Browse our handcrafted cakes by category</p>
        
        <div className={styles.filters}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.filterBtn} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading cakes...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>{error}</div>
        ) : filteredCakes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>No cakes found in this category.</div>
        ) : (
          <div className={styles.grid}>
            {filteredCakes.map((cake: any) => (
              <CakeCard key={cake._id} cake={cake} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function CakesPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>Loading...</div>}>
        <CakesContent />
      </Suspense>
      <Footer />
    </>
  );
}
