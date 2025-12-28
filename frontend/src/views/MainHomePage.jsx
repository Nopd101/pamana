import Footer from "../components/Footer";
import FeatureCard from "../components/FeatureCard";
import KabihasnanCard from "../components/KabihasnanCard";
import styles from "./MainHomePage.module.css";
import characterLeft from "../assets/main-home-character-left.png";
import characterRight from "../assets/main-home-character-right.png";

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
      <div className={styles.featuresSectionWrapper}>
        <section className={styles.featuresSection}>
          <img src={characterLeft} alt="" className={styles.characterLeft} />
          <img src={characterRight} alt="" className={styles.characterRight} />
          <div className={styles.sectionTitleWrapper}>
            <h2 className={styles.sectionTitle}>FEATURES</h2>
            <p className={styles.sectionSubtitle}>OF PAMANA</p>
          </div>

          <div className={styles.featuresGrid}>
            <FeatureCard
              icon={<i className="fa-solid fa-video"></i>}
              color="Tan"
              desc="Animated video lectures to engage the youth in ancient civilizations."
            />
            <FeatureCard
              icon={<i className="fa-solid fa-people-group"></i>}
              color="DarkBrown"
              desc="Prioritizing the assessment of student's prior knowledge."
            />
            <FeatureCard
              icon={<i className="fa-solid fa-gamepad"></i>}
              color="Orange"
              desc="Ten interactive games are prepared for a fun learning experience."
            />
            <FeatureCard
              icon={<i className="fa-solid fa-star"></i>}
              color="Brown"
              desc="Automatic progress tracking for students."
            />
          </div>
        </section>
      </div>

      {/* KABIHASNAN SECTION */}
      <section className={styles.kabihasnanSection}>
        <h2 className={styles.kabihasnanTitle}>The</h2>
        <h1 className={styles.kabihasnanMainTitle}>CIVILIZATIONS</h1>
        <p className={styles.kabihasnanSubtitle}>To Discover</p>

        <div className={styles.kabihasnanList}>
          <KabihasnanCard
            number={1}
            title="Kabihasnang Mesopotamia"
            description='Found between the Tigris and Euphrates rivers, it is called the "Cradle of Civilization." The first system of writing and law emerged here.'
            imagePosition="right"
            patternOffsetY="0%"
          />
          <KabihasnanCard
            number={2}
            title="Kabihasnang Indus"
            description="Known for its well-planned cities and canal systems. It shows the importance of discipline and planning in a community."
            imagePosition="left"
            patternOffsetY="25%"
          />
          <KabihasnanCard
            number={3}
            title="Kabihasnang Tsina (Shang Dynasty)"
            description="Ideas about government, family, and philosophy that influence the present day began here."
            imagePosition="right"
            patternOffsetY="50%"
          />
          <KabihasnanCard
            number={4}
            title="Kabihasnang Egypt"
            description="Flourished along the Nile River and is known for its pyramids, belief in the afterlife, and excellent knowledge of science and art."
            imagePosition="left"
            patternOffsetY="75%"
          />
          <KabihasnanCard
            number={5}
            title="Kabihasnang Mesoamerica"
            description="Home to the Maya and Aztec civilizations, with unique knowledge in calendars, mathematics, and astronomy."
            imagePosition="right"
            patternOffsetY="100%"
          />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
