'use client';

import styles from './CakeCard.module.css';

interface CakeCardProps {
  cake: {
    id: string;
    name: string;
    category: string;
    price: number;
    sizeWeight: { min: number; max: number };
    ingredients: string[];
    imageUrl: string;
  };
}

export default function CakeCard({ cake }: CakeCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imagePlaceholder}>
        <span>🎂</span>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{cake.name}</h3>
          <span className={styles.price}>₹{cake.price}</span>
        </div>
        <div className={styles.meta}>
          <span className={styles.category}>{cake.category}</span>
          <span className={styles.size}>
            {cake.sizeWeight.min} - {cake.sizeWeight.max} kg
          </span>
        </div>
        <div className={styles.ingredients}>
          <strong>Ingredients:</strong> {cake.ingredients.join(', ')}
        </div>
        <button className={`btn btn-secondary ${styles.btn}`}>Add to Cart</button>
      </div>
    </div>
  );
}
