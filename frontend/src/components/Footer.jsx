import footerCharacter from '../assets/footer-character.png';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative font-sans text-[#432818] z-10">
      <div className="bg-[#F3F0E8] pt-10 pb-16 px-2.5 rounded-t-[62.4px] relative overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between max-w-6xl mx-auto relative z-[2] gap-24">
          <div className="flex-1">
            <h3 className="text-6xl font-bold mb-4">PAMANA</h3>
            <p className="max-w-[300px] mb-4 leading-relaxed text-lg">
              An interactive learning platform for Grade 8 Social Studies students.
            </p>
            <button onClick={scrollToTop} className="bg-gradient-to-b from-[#772402] to-[#551900] text-white border-none py-3.5 px-7 rounded-3xl cursor-pointer text-lg font-bold shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
              Back on top
            </button>
          </div>

          <div className="flex-1 text-left pl-36">
            <h3 className="text-4xl font-bold mb-6">Site Map</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-1"><a href="/" className="text-[#432818] no-underline font-bold text-lg">Homepage</a></li>
              <li className="mb-1"><a href="/faq" className="text-[#432818] no-underline font-bold text-lg">FAQ Page</a></li>
              <li className="mb-1"><a href="/contact" className="text-[#432818] no-underline font-bold text-lg">Contact Us</a></li>
              <li className="mb-1"><a href="/about" className="text-[#432818] no-underline font-bold text-lg">About Us</a></li>
              <li><a href="/privacy" className="text-[#432818] no-underline font-bold text-lg">Privacy & Terms</a></li>
            </ul>
          </div>
        </div>
        <img src={footerCharacter} alt="Character" className="absolute right-[-200px] bottom-[-400px] w-[700px] z-[1]" />
      </div>

      <div className="bg-[#D9D9D9] p-4 rounded-t-[62.4px] relative z-[3] mt-[-30px]">
        <p className="text-center text-sm font-bold">
          Copyright © 2025, Pamana.edu, All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
