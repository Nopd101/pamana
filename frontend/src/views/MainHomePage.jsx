import Footer from "../components/Footer";
import FeatureCard from "../components/FeatureCard";
import styles from "./MainHomePage.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      
      {/* HERO SECTION */}
      <section
        className={styles.heroSection}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.titleWrapper}>
            <img 
              src="/src/assets/pamana-title.png" 
              alt="PAMANA" 
              className={styles.heroTitleImage}
            />
          </div>
          <p className={styles.heroSubtitle}>
            Preserving Ancient Memories and Narratives through Advancement
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.featuresSection}>
        <img 
          src="/src/assets/main-home-character-left.png" 
          alt="Character Left" 
          className={styles.characterLeft}
        />
        <img 
          src="/src/assets/main-home-character-right.png" 
          alt="Character Right" 
          className={styles.characterRight}
        />
        
        <div className={styles.sectionTitleWrapper}>
          <h2 className={styles.sectionTitle}>MGA KATANGIAN</h2>
          <p className={styles.sectionSubtitle}>NG PAMANA</p>
        </div>

        <div className={styles.featuresGrid}>
          <FeatureCard
            icon={<i className="fa-solid fa-video"></i>}
            color="Tan"
            desc="Animated na video lectures para makilahok ang mga kabataan sa sinaynt kabihasnaan"
          />
          <FeatureCard
            icon={<i className="fa-solid fa-people-group"></i>}
            color="DarkBrown"
            desc="Unang kikilayanin ang mailuluturang ng mga mag-aaral"
          />
          <FeatureCard
            icon={<i className="fa-solid fa-gamepad"></i>}
            color="Orange"
            desc="Sampung interactive games ang nakataan para sa masayang pag-aaral"
          />
          <FeatureCard
            icon={<i className="fa-solid fa-star"></i>}
            color="Brown"
            desc="Automatic na pagsubaybay ng lakas para sa mga mag-aaral"
          />
        </div>
      </section>

      {/* KABIHASNAN SECTION */}
      <section className={styles.kabihasnanSection}>
        <h2 className={styles.kabihasnanTitle}>Kabihasnang</h2>

        <div className={styles.kabihasnanList}>
          {[
            "Kabihasnang Mesopotamia",
            "Kabihasnang Indus",
            "Kabihasnang Tsina (Shang Dynasty)",
            "Kabihasnang Egypt",
            "Kabihasnang Kabihasnang Mesoamerica",
          ].map((item, index) => (
            <div
              key={index}
              className={styles.kabihasnanCard}
            >
              <h3 className={styles.kabihasnanCardTitle}>{index + 1}. {item}</h3>
              <p className={styles.kabihasnanCardDesc}>
                Maikling paglalarawan ng kabihasnang ito.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
