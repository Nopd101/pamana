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
        <div className={styles.sectionTitleWrapper}>
          <h2 className={styles.sectionTitle}>MGA KATANGIAN</h2>
          <p className={styles.sectionSubtitle}>NG PAMANA</p>
        </div>

        <div className={styles.featuresGrid}>
          <FeatureCard
            title="Interactive Stories"
            desc="Explore ancient civilizations through guided storytelling."
          />
          <FeatureCard
            title="User Profiles"
            desc="Track progress and achievements."
          />
          <FeatureCard
            title="Mini Games"
            desc="Learn history through engaging activities."
          />
          <FeatureCard
            title="Assessments"
            desc="Evaluate learning with interactive quizzes."
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
