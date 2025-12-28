export default function KabihasnanCard({ number, title, description, imagePosition, patternOffsetY }) {
  const cardStyles = {
    '--pattern-offset-y': patternOffsetY,
  };

  const imagePositionClass = imagePosition === 'left' ? 'text-right pl-[250px] before:bg-[url("/src/assets/card-bg-right.png")] before:bg-[position:left_var(--pattern-offset-y,center)] before:left-0' : 'text-left pr-[250px] before:bg-[url("/src/assets/card-bg-left.png")] before:bg-[position:right_var(--pattern-offset-y,center)] before:right-0';

  return (
    <div
      className={`w-full max-w-[900px] h-[140px] mx-auto my-0 p-6 rounded-[20px] text-white bg-[#52392F] flex items-center shadow-[0_12px_10px_rgba(0,0,0,0.452)] relative overflow-hidden 
                 before:content-[''] before:absolute before:top-0 before:w-[400px] before:h-full before:bg-no-repeat before:grayscale before:brightness-75 before:opacity-25 before:z-0 before:bg-cover
                 lg:h-auto lg:p-8 lg:flex-col lg:before:hidden
                 ${imagePositionClass}`}
      style={cardStyles}
    >
      <div className="flex-grow p-4 rounded-[10px] relative z-[1] lg:text-center lg:p-4">
        <h3 className="text-2xl font-bold mb-2 text-[#B89336] tracking-wider lg:text-xl">
          {number}. {title}
        </h3>
        <p className="text-base leading-relaxed font-normal lg:text-sm">• {description}</p>
      </div>
    </div>
  );
}
