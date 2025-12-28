import Footer from "../components/Footer";
import FeatureCard from "../components/FeatureCard";
import KabihasnanCard from "../components/KabihasnanCard";
import styles from "./MainHomePage.module.css";
import characterLeft from "../assets/main-home-character-left.png";
import characterRight from "../assets/main-home-character-right.png";
import { useInView } from "react-intersection-observer";

const AnimatedElement = ({ children, className, animation = "fadeInUp", style }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`${className} animated ${inView ? animation : ""}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default function Home() {
  return (
    <div className={styles.container}>
      
      {/* HERO SECTION */}
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <AnimatedElement
          className={styles.heroContent}
          animation="fadeInUp"
        >
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
        </AnimatedElement>
      </div>

      {/* FEATURES */}
      <div className={styles.featuresSectionWrapper}>
        <div className={styles.featuresSection}>
          <AnimatedElement animation="slideInLeft">
            <img src={characterLeft} alt="" className={styles.characterLeft} />
          </AnimatedElement>
          <AnimatedElement animation="slideInRight" style={{ animationDelay: "0.1s" }}>
            <img src={characterRight} alt="" className={styles.characterRight} />
          </AnimatedElement>
          
          <AnimatedElement className={styles.sectionTitleWrapper}>
            <h2 className={styles.sectionTitle}>FEATURES</h2>
            <p className={styles.sectionSubtitle}>OF PAMANA</p>
          </AnimatedElement>

          <div className={styles.featuresGrid}>
            <AnimatedElement>
              <FeatureCard
                icon={<i className="fa-solid fa-video"></i>}
                color="Tan"
                desc="Animated video lectures to engage the youth in ancient civilizations."
              />
            </AnimatedElement>
            <AnimatedElement style={{ animationDelay: "0.1s" }}>
              <FeatureCard
                icon={<i className="fa-solid fa-people-group"></i>}
                color="DarkBrown"
                desc="Prioritizing the assessment of student's prior knowledge."
              />
            </AnimatedElement>
            <AnimatedElement style={{ animationDelay: "0.2s" }}>
              <FeatureCard
                icon={<i className="fa-solid fa-gamepad"></i>}
                color="Orange"
                desc="Ten interactive games are prepared for a fun learning experience."
              />
            </AnimatedElement>
            <AnimatedElement style={{ animationDelay: "0.3s" }}>
              <FeatureCard
                icon={<i className="fa-solid fa-star"></i>}
                color="Brown"
                desc="Automatic progress tracking for students."
              />
            </AnimatedElement>
          </div>
        </div>
      </div>

      {/* KABIHASNAN SECTION */}
      <div className={styles.kabihasnanSection}>
        <div>
          <h2 className={styles.kabihasnanTitle}>The</h2>
          <h1 className={styles.kabihasnanMainTitle}>CIVILIZATIONS</h1>
          <p className={styles.kabihasnanSubtitle}>To Discover</p>
        </div>

        <div className={styles.kabihasnanList}>
          <AnimatedElement animation="slideInRight" className={styles.kabihasnanCardWrapper}>
            <KabihasnanCard
              number={1}
              title="Kabihasnang Mesopotamia"
              description='Found between the Tigris and Euphrates rivers, it is called the "Cradle of Civilization." The first system of writing and law emerged here.'
              imagePosition="right"
              patternOffsetY="0%"
            />
          </AnimatedElement>
          <AnimatedElement animation="slideInRight" className={styles.kabihasnanCardWrapper}>
            <KabihasnanCard
              number={2}
              title="Kabihasnang Indus"
              description="Known for its well-planned cities and canal systems. It shows the importance of discipline and planning in a community."
              imagePosition="left"
              patternOffsetY="25%"
            />
          </AnimatedElement>
          <AnimatedElement animation="slideInRight" className={styles.kabihasnanCardWrapper}>
            <KabihasnanCard
              number={3}
              title="Kabihasnang Tsina (Shang Dynasty)"
              description="Ideas about government, family, and philosophy that influence the present day began here."
              imagePosition="right"
              patternOffsetY="50%"
            />
          </AnimatedElement>
          <AnimatedElement animation="slideInRight" className={styles.kabihasnanCardWrapper}>
            <KabihasnanCard
              number={4}
              title="Kabihasnang Egypt"
              description="Flourished along the Nile River and is known for its pyramids, belief in the afterlife, and excellent knowledge of science and art."
              imagePosition="left"
              patternOffsetY="75%"
            />
          </AnimatedElement>
          <AnimatedElement animation="slideInRight" className={styles.kabihasnanCardWrapper}>
            <KabihasnanCard
              number={5}
              title="Kabihasnang Mesoamerica"
              description="Home to the Maya and Aztec civilizations, with unique knowledge in calendars, mathematics, and astronomy."
              imagePosition="right"
              patternOffsetY="100%"
            />
          </AnimatedElement>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
