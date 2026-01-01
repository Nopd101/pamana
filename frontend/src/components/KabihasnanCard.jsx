export default function KabihasnanCard({ number, title, description, imagePosition, patternOffsetY, children }) {
  const cardStyles = {
    '--pattern-offset-y': patternOffsetY,
  };

  // Mobile-first base classes
  const baseClasses = "w-full max-w-[900px] mx-auto my-0 p-6 rounded-[20px] text-white bg-[#52392F] flex flex-col items-center text-center shadow-[0_12px_10px_rgba(0,0,0,0.452)] relative overflow-hidden h-auto p-6 rounded-[15px] md:p-4";

  // Desktop-specific overrides
  const desktopClasses = imagePosition === 'left'
    ? "lg:flex-row lg:text-right lg:pl-[250px]"
    : "lg:flex-row lg:text-left lg:pr-[250px]";

  const patternClasses = imagePosition
    ? `before:hidden lg:before:block before:content-[''] before:absolute before:top-0 before:w-[400px] before:h-full before:bg-no-repeat before:grayscale before:brightness-75 before:opacity-25 before:z-0 before:bg-cover`
    : '';
  
  const patternImageClass = imagePosition === 'left'
    ? "before:bg-[url('/src/assets/card-bg-right.png')] before:bg-[position:left_var(--pattern-offset-y,center)] before:left-0"
    : "before:bg-[url('/src/assets/card-bg-left.png')] before:bg-[position:right_var(--pattern-offset-y,center)] before:right-0";


  return (
    <div
      className={`${baseClasses} ${desktopClasses} ${patternClasses} ${imagePosition ? patternImageClass : ''}`}
      style={cardStyles}
    >
      <div className="flex-grow p-4 rounded-[10px] relative z-[1] lg:p-4">
        {children ? (
          children
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-2 text-[#B89336] tracking-wider lg:text-xl md:text-lg">
              {number}. {title}
            </h3>
            <p className="text-lg leading-relaxed font-normal lg:text-base md:text-sm">• {description}</p>
          </>
        )}
      </div>
    </div>
  );
}
