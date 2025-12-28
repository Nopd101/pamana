import Footer from "../components/Footer";
import FeatureCard from "../components/FeatureCard";
import KabihasnanCard from "../components/KabihasnanCard";
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
      <div className={styles.featuresSectionWrapper}>
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
      </div>

      {/* KABIHASNAN SECTION */}
      <section className={styles.kabihasnanSection}>
        <h2 className={styles.kabihasnanTitle}>Mga</h2>
        <h1 className={styles.kabihasnanMainTitle}>KABIHASNANG</h1>
        <p className={styles.kabihasnanSubtitle}>Matutunghayan</p>

        <div className={styles.kabihasnanList}>
          <KabihasnanCard
            number={1}
            title="Kabihasnang Mesopotamia"
            description='Matatagpuan sa pagitan ng ilog Tigris at Euphrates, ito ang tinaguriang "Cradle of Civilization." Dito umusbong ang unang sistema ng pagsulat at batas.'
            imagePosition="right"
            patternOffsetY="0%"
          />
          <KabihasnanCard
            number={2}
            title="Kabihasnang Indus"
            description="Kilala sa maayos na lungsod at sistema ng kanal. Ipinapakita nito ang kahalagahan ng disiplina at pagpaplano sa pamayanan."
            imagePosition="left"
            patternOffsetY="25%"
          />
          <KabihasnanCard
            number={3}
            title="Kabihasnang Tsina (Shang Dynasty)"
            description="Dito nagsimula ang mga ideya tungkol sa pamahalaan, pamilya, at pilosopiya na may impluwensiya hanggang sa kasalukuyan."
            imagePosition="right"
            patternOffsetY="50%"
          />
          <KabihasnanCard
            number={4}
            title="Kabihasnang Egypt"
            description="Sumibol sa tabing Ilog Nile at kilala sa mga piramide, paniniwala sa kabilang-buhay, at mahusay na kaalaman sa agham at sining."
            imagePosition="left"
            patternOffsetY="75%"
          />
          <KabihasnanCard
            number={5}
            title="Kabihasnang Mesoamerica"
            description="Tahanan ng mga Maya at Aztec na may kakaibang kaalaman sa kalendaryo, matematika, at astronomiya."
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
