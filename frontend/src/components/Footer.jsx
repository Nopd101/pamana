import styles from './Footer.module.css';
import footerCharacter from '../assets/footer-character.png';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerContent}>
          <div className={styles.leftSection}>
            <h3 className={styles.logo}>PAMANA</h3>
            <p className={styles.description}>
              Isang interactive learning platform para sa Grade 8 Araling
              Panlipunan students.
            </p>
            <button onClick={scrollToTop} className={styles.backToTopBtn}>
              Back on top
            </button>
          </div>

          <div className={styles.siteMap}>
            <h3>Site Map</h3>
            <ul>
              <li><a href="/">Homepage</a></li>
              <li><a href="/faq">FAQ Page</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/privacy">Privacy & Terms</a></li>
            </ul>
          </div>
        </div>
        <img src={footerCharacter} alt="Character" className={styles.characterImage} />
      </div>


      <div className={styles.copyrightWrapper}>
        <p className={styles.copyright}>
          Copyright © 2025, pamana.edu, All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
