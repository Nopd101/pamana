export default function KabihasnanCard({ number, title, description, imagePosition, patternOffsetY, children }) {
  const cardStyles = {
    '--pattern-offset-y': patternOffsetY,
  };

  // Mobile-first base classes
  const baseClasses = "w-full max-w-[900px] mx-auto my-0 p-6 rounded-[20px] text-white bg-[#52392F] flex flex-col items-center text-center shadow-[0_12px_10px_rgba(0,0,0,0.452)] relative overflow-hidden h-auto";

  // Desktop-specific overrides
  const desktopClasses = imagePosition === 'left'
    ? "md:flex-row md:text-right md:pl-[250px]"
    : "md:flex-row md:text-left md:pr-[250px]";

  const patternClasses = imagePosition
    ? `before:hidden md:before:block before:content-[''] before:absolute before:top-0 before:w-[400px] before:h-full before:bg-no-repeat before:grayscale before:brightness-75 before:opacity-25 before:z-0 before:bg-cover`
    : '';
  
  const patternImageClass = imagePosition === 'left'
    ? "before:bg-[url('/src/assets/card-bg-right.png')] before:bg-[position:left_var(--pattern-offset-y,center)] before:left-0"
    : "before:bg-[url('/src/assets/card-bg-left.png')] before:bg-[position:right_var(--pattern-offset-y,center)] before:right-0";


  return (
    <div
      className={`${baseClasses} ${desktopClasses} ${patternClasses} ${imagePosition ? patternImageClass : ''}`}
      style={cardStyles}
    >
      <div className="flex-grow p-4 rounded-[10px] relative z-[1]">
        {children ? (
          children
        ) : (
          <>
            <h3 className="text-xl font-bold mb-2 text-[#B89336] tracking-wider md:text-2xl">
              {number}. {title}
            </h3>
            <p className="text-base leading-relaxed font-normal md:text-lg">• {description}</p>
          </>
        )}
      </div>
    </div>
  );
}
