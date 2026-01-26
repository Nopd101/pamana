import Footer from "../components/Footer";
import { useInView } from "react-intersection-observer";
import KabihasnanCard from "../components/KabihasnanCard";
import pamanaTitle from "../assets/pamana-title.png";


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

export default function FAQPage() {
  return (
    <div className="bg-[#f6efe6] text-[#3b2a1a]">
      
      {/* HERO SECTION */}
      <div className="relative h-[500px] bg-cover bg-center flex items-center justify-center before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('/src/assets/main-home-bg.png')] before:bg-cover before:bg-center before:opacity-50 before:z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#f1f1f111] z-[1]"></div>
        <AnimatedElement
          className="relative z-[2] text-center p-12"
          animation="fadeInUp"
        >
          <div className="flex items-center justify-center">
            <span className="w-[50px] h-[3px] bg-gradient-to-r from-[#3d2817] via-[#5a3b26] to-[#3d2817] block rounded-[10px] filter drop-shadow-[0_5px_5px_rgb(0,0,0)]"></span>
            <img 
              src={pamanaTitle}
              alt="PAMANA" 
              className="max-w-[550px] w-full h-auto mx-auto block filter drop-shadow-[0_12px_5px_rgba(0,0,0,0.452)]"
            />
            <span className="w-[50px] h-[3px] bg-gradient-to-r from-[#3d2817] via-[#5a3b26] to-[#3d2817] block rounded-[10px] filter drop-shadow-[0_5px_5px_rgb(0,0,0)]"></span>
          </div>
          <p className="text-lg mt-4 text-black font-medium tracking-[0.1em] text-shadow-[0_5px_5px_rgba(0,0,0,0.596)] text-center">
            Preserving Ancient Memories and Narratives through Advancement
          </p>
        </AnimatedElement>
      </div>

      {/* Title */}
      <div className="shadow-[0_-10px_30px_rgba(0,0,0,0.5)] bg-[#f6efe6] py-32">
          <AnimatedElement className="relative z-[2] text-center">
            <h2 className="text-4xl font-bold tracking-[0.15em] m-0 p-0 text-[#772402] text-center filter drop-shadow-[0_12px_5px_rgba(0,0,0,0.452)]">FREQUENTLY ASKED QUESTIONS (FAQ)</h2>
          </AnimatedElement>
      </div>

      {/* FAQ CONTENT */}
      <div className="py-20 px-8 pb-60 text-center bg-[#f6efe6] relative isolate mb-[-62.4px] z-0 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('/src/assets/main-home-bg-2.png')] before:bg-cover before:bg-center before:opacity-25 before:z-[-1]">
        <div className="flex flex-col items-center gap-8 w-full">
            <AnimatedElement animation="slideInRight" className="w-full">
                <KabihasnanCard imagePosition="right">
                    <div className="relative z-10 text-left">
                        <h2 className="text-xl font-bold mb-4 text-[#B89336] tracking-wider">Para sa mga Mag-aaral</h2>
                        <h3 className="text-lg font-semibold mt-4 text-white">Paano ako magla-log in?</h3>
                        <p className="text-base leading-relaxed font-normal text-white">
                        Ilagay ang iyong pangalan, paaralan, at seksyon sa login page.
                        </p>
                        <h3 className="text-lg font-semibold mt-4 text-white">Ano ang magagawa ko sa loob ng PAMANA?</h3>
                        <p className="text-base leading-relaxed font-normal text-white">
                        Manood ng mga video lecture, maglaro ng mini-games, at sagutin ang mga quiz. Awtomatikong nasusubaybayan ang iyong mga puntos.
                        </p>
                        <h3 className="text-lg font-semibold mt-4 text-white">Paano ko masusubaybayan ang aking progreso?</h3>
                        <p className="text-base leading-relaxed font-normal text-white">
                        Bisitahin ang iyong Profile Page upang makita ang mga natapos na module, quiz scores, at resulta ng laro.
                        </p>
                    </div>
                </KabihasnanCard>
            </AnimatedElement>
            <AnimatedElement animation="slideInLeft" className="w-full">
                <KabihasnanCard imagePosition="left">
                    <div className="relative z-10 text-left">
                        <h2 className="text-xl font-bold mb-4 text-[#B89336] tracking-wider">Para sa Mga Guro</h2>
                        <h3 className="text-lg font-semibold mt-4 text-white">Paano ko makikita ang progreso ng mga estudyante?</h3>
                        <p className="text-base leading-relaxed font-normal text-white">
                        Gamitin ang Teacher Dashboard upang makita ang performance ng klase, quiz scores, at resulta ng laro.
                        </p>
                        <h3 className="text-lg font-semibold mt-4 text-white">Puwede ba akong mag-download ng mga report?</h3>
                        <p className="text-base leading-relaxed font-normal text-white">
                        Oo, maaaring i-export ang mga report para isumite sa school administration.
                        </p>
                    </div>
                </KabihasnanCard>
            </AnimatedElement>
            <AnimatedElement animation="slideInRight" className="w-full">
                <KabihasnanCard imagePosition="right">
                    <div className="relative z-10 text-left">
                        <h2 className="text-xl font-bold mb-4 text-[#B89336] tracking-wider">Para sa Admins</h2>
                        <h3 className="text-lg font-semibold mt-4 text-white">Paano ko pamamahalaan ang mga user?</h3>
                        <p className="text-base leading-relaxed font-normal text-white">
                        Gamitin ang Admin Dashboard upang gumawa ng account, mag-assign ng seksyon, at i-reset ang mga password.
                        </p>
                    </div>
                </KabihasnanCard>
            </AnimatedElement>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
