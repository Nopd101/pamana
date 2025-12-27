import styles from './FeatureCard.module.css';

export default function FeatureCard({ title, desc, icon: IconComponent, color }) {
  const colorClass = styles[`card${color}`] || styles.cardBrown;
  
  return (
    <div className={`${styles.card} ${colorClass}`}>
      <div className={styles.iconCircle}>
        {IconComponent}
      </div>
      <div className={styles.textContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{desc}</p>
      </div>
    </div>
  );
}
