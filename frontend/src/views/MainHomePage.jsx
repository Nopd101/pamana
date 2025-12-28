import Footer from "../components/Footer";
import FeatureCard from "../components/FeatureCard";
import KabihasnanCard from "../components/KabihasnanCard";
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
    <div className="bg-[#f6efe6] text-[#3b2a1a]">
      
      {/* HERO SECTION */}
      <div className="relative h-[965px] bg-cover bg-center flex items-center justify-center before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('/src/assets/main-home-bg.png')] before:bg-cover before:bg-center before:opacity-50 before:z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#f1f1f111] z-[1]"></div>
        <AnimatedElement
          className="relative z-[2] text-center p-12"
          animation="fadeInUp"
        >
          <div className="flex items-center justify-center">
            <span className="w-[67.5px] h-[4.5px] bg-gradient-to-r from-[#3d2817] via-[#5a3b26] to-[#3d2817] block rounded-[10px] filter drop-shadow-[0_5px_5px_rgb(0,0,0)]"></span>
            <img 
              src="/src/assets/pamana-title.png" 
              alt="PAMANA" 
              className="max-w-[750px] w-full h-auto mx-auto block filter drop-shadow-[0_12px_5px_rgba(0,0,0,0.452)]"
            />
            <span className="w-[67.5px] h-[4.5px] bg-gradient-to-r from-[#3d2817] via-[#5a3b26] to-[#3d2817] block rounded-[10px] filter drop-shadow-[0_5px_5px_rgb(0,0,0)]"></span>
          </div>
          <p className="text-xl mt-6 text-black font-medium tracking-[0.12em] text-shadow-[0_5px_5px_rgba(0,0,0,0.596)] text-center">
            Preserving Ancient Memories and Narratives through Advancement
          </p>
        </AnimatedElement>
      </div>

      {/* FEATURES */}
      <div className="shadow-[0_-10px_30px_rgba(0,0,0,0.5)] bg-[#f6efe6]">
        <div className="relative py-18 overflow-hidden">
          <AnimatedElement animation="slideInLeft">
            <img src={characterLeft} alt="" className="absolute left-[-120px] top-[-130px] h-[600px] w-auto z-[1] opacity-90 transform rotate-45" />
          </AnimatedElement>
          <AnimatedElement animation="slideInRight" style={{ animationDelay: "0.1s" }}>
            <img src={characterRight} alt="" className="absolute right-[-120px] top-[-50px] h-[600px] w-auto z-[1] opacity-90 transform -rotate-45" />
          </AnimatedElement>
          
          <AnimatedElement className="relative z-[2] text-center mb-18">
            <h2 className="text-4xl font-bold tracking-[0.15em] m-0 p-0 text-[#3b2a1a] text-center">FEATURES</h2>
            <p className="text-sm tracking-[2.25rem] text-[#6b5544] text-center pl-6 font-bold">OF PAMANA</p>
          </AnimatedElement>

          <div className="relative z-[2] flex justify-center gap-8 flex-wrap max-w-full mx-auto">
            <AnimatedElement>
              <FeatureCard
                icon="fa-solid fa-video"
                color="Tan"
                desc="Animated video lectures to engage the youth in ancient civilizations."
              />
            </AnimatedElement>
            <AnimatedElement style={{ animationDelay: "0.1s" }}>
              <FeatureCard
                icon="fa-solid fa-people-group"
                color="DarkBrown"
                desc="Prioritizing the assessment of student's prior knowledge."
              />
            </AnimatedElement>
            <AnimatedElement style={{ animationDelay: "0.2s" }}>
              <FeatureCard
                icon="fa-solid fa-gamepad"
                color="Orange"
                desc="Ten interactive games are prepared for a fun learning experience."
              />
            </AnimatedElement>
            <AnimatedElement style={{ animationDelay: "0.3s" }}>
              <FeatureCard
                icon="fa-solid fa-star"
                color="Brown"
                desc="Automatic progress tracking for students."
              />
            </AnimatedElement>
          </div>
        </div>
      </div>

      {/* KABIHASNAN SECTION */}
      <div className="py-20 px-8 pb-60 text-center bg-[#f6efe6] relative isolate mb-[-62.4px] z-0 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('/src/assets/main-home-bg-2.png')] before:bg-cover before:bg-center before:opacity-25 before:z-[-1]">
        <div>
          <h2 className="text-2xl font-semibold tracking-[0.35em] m-0 mt-12 p-0 text-[#3b2a1a] uppercase">The</h2>
          <h1 className="text-6xl font-black tracking-[0.05em] m-0 p-0 text-[#772402] filter drop-shadow-[0_12px_5px_rgba(0,0,0,0.452)]">CIVILIZATIONS</h1>
          <p className="text-lg tracking-[0.75em] text-[#6b5544] text-center pl-3 font-bold">To Discover</p>
        </div>

        <div className="mt-20 flex flex-col gap-8">
          <AnimatedElement animation="slideInRight" className="w-full">
            <KabihasnanCard
              number={1}
              title="Kabihasnang Mesopotamia"
              description='Found between the Tigris and Euphrates rivers, it is called the "Cradle of Civilization." The first system of writing and law emerged here.'
              imagePosition="right"
              patternOffsetY="0%"
            />
          </AnimatedElement>
          <AnimatedElement animation="slideInRight" className="w-full">
            <KabihasnanCard
              number={2}
              title="Kabihasnang Indus"
              description="Known for its well-planned cities and canal systems. It shows the importance of discipline and planning in a community."
              imagePosition="left"
              patternOffsetY="25%"
            />
          </AnimatedElement>
          <AnimatedElement animation="slideInRight" className="w-full">
            <KabihasnanCard
              number={3}
              title="Kabihasnang Tsina (Shang Dynasty)"
              description="Ideas about government, family, and philosophy that influence the present day began here."
              imagePosition="right"
              patternOffsetY="50%"
            />
          </AnimatedElement>
          <AnimatedElement animation="slideInRight" className="w-full">
            <KabihasnanCard
              number={4}
              title="Kabihasnang Egypt"
              description="Flourished along the Nile River and is known for its pyramids, belief in the afterlife, and excellent knowledge of science and art."
              imagePosition="left"
              patternOffsetY="75%"
            />
          </AnimatedElement>
          <AnimatedElement animation="slideInRight" className="w-full">
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
