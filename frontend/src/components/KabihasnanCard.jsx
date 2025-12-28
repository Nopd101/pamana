import styles from './KabihasnanCard.module.css';

export default function KabihasnanCard({ number, title, description, imagePosition, patternOffsetY }) {
  const cardClasses = `${styles.card} ${imagePosition === 'left' ? styles.left : styles.right}`;
  const cardStyles = {
    '--pattern-offset-y': patternOffsetY,
  };

  return (
    <div className={cardClasses} style={cardStyles}>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{number}. {title}</h3>
        <p className={styles.description}>• {description}</p>
      </div>
    </div>
  );
}
