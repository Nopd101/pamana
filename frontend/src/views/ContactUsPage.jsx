import Footer from "../components/Footer";
import { useInView } from "react-intersection-observer";
import KabihasnanCard from "../components/KabihasnanCard";

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

export default function ContactUsPage() {
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
              src="/src/assets/pamana-title.png" 
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
            <h2 className="text-4xl font-bold tracking-[0.15em] m-0 p-0 text-[#772402] text-center filter drop-shadow-[0_12px_5px_rgba(0,0,0,0.452)]">CONTACT US</h2>
          </AnimatedElement>
      </div>

      {/* CONTACT US CONTENT */}
      <div className="py-20 px-8 pb-60 text-center bg-[#f6efe6] relative isolate mb-[-62.4px] z-0 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('/src/assets/main-home-bg-2.png')] before:bg-cover before:bg-center before:opacity-25 before:z-[-1]">
        <div className="flex flex-col items-center gap-8 w-full">
            <AnimatedElement animation="slideInRight" className="w-full my-32">
                <KabihasnanCard imagePosition="right">
                    <div className="relative z-10 text-left">
                        <h2 className="text-xl font-bold mb-2 text-[#B89336] tracking-wider">We value your feedback and are here to help.</h2>
                        <p className="text-base leading-relaxed font-normal text-white">
                        For any concerns, technical issues, academic questions, or general suggestions, please email us at:
                        </p>
                        <a href="mailto:pamanadevteam@gmail.com" className="text-base font-bold mt-4 inline-block text-[#f6efe6] hover:underline">
                        pamanadevteam@gmail.com
                        </a>
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
