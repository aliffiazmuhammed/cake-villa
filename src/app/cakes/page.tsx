'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CakeCard from "../../components/CakeCard";
import styles from "./cakes.module.css";

const mockCakes = [
  { id: '1', name: 'Classic Wedding Tower', category: 'wedding', price: 12000, sizeWeight: { min: 3, max: 10 }, ingredients: ['Vanilla Sponge', 'Buttercream', 'Edible Flowers'], imageUrl: '' },
  { id: '2', name: 'Chocolate Overload', category: 'birthday', price: 1500, sizeWeight: { min: 1, max: 3 }, ingredients: ['Belgian Chocolate', 'Ganache', 'Truffles'], imageUrl: '' },
  { id: '3', name: 'Custom Photo Cake', category: 'photo', price: 1800, sizeWeight: { min: 1, max: 2 }, ingredients: ['Vanilla', 'Edible Print', 'Cream'], imageUrl: '' },
  { id: '4', name: 'Rainbow Cupcake Set', category: 'cupcake', price: 800, sizeWeight: { min: 0.5, max: 1 }, ingredients: ['Assorted Flavors', 'Frosting'], imageUrl: '' },
  { id: '5', name: 'Sculpted Teddy Cake', category: 'fondant', price: 2500, sizeWeight: { min: 1.5, max: 3 }, ingredients: ['Chocolate', 'Fondant', 'Marshmallow'], imageUrl: '' },
  { id: '6', name: 'New York Cheesecake', category: 'cheesecake', price: 1200, sizeWeight: { min: 1, max: 2 }, ingredients: ['Cream Cheese', 'Graham Cracker Crust'], imageUrl: '' },
];

const categories = ['all', 'wedding', 'birthday', 'photo', 'cupcake', 'fondant', 'cheesecake'];

function CakesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  const filteredCakes = selectedCategory === 'all' 
    ? mockCakes 
    : mockCakes.filter(cake => cake.category === selectedCategory);

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
        
        <div className={styles.grid}>
          {filteredCakes.map(cake => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
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
