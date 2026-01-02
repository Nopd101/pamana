export default function FeatureCard({ title, desc, icon, color }) {
  const colorClasses = {
    Tan: "from-[#C29B6C] to-[#674422] [--icon-color:#C29B6C]",
    DarkBrown: "from-[#772402] to-[#551900] [--icon-color:#772402]",
    Orange: "from-[#E49419] to-[#924F14] [--icon-color:#E49419]",
    Brown: "from-[#52392F] to-[#674422] [--icon-color:#52392F]",
  };

  const cardColor = colorClasses[color] || colorClasses.Brown;

  return (
    <div
      className={`w-full max-w-[230px] h-auto rounded-[20px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white flex flex-col items-center gap-4 mx-auto mb-8 bg-gradient-to-b ${cardColor} sm:w-[200px] sm:p-8 sm:gap-5 md:w-[230px] md:h-[310px] md:p-12`}
    >
      <div className="w-[80px] h-[80px] bg-white rounded-[15px] flex items-center justify-center text-4xl text-[var(--icon-color)] shadow-[inset_0_6px_8px_rgba(0,0,0,0.349)] sm:w-[90px] sm:h-[90px] sm:text-5xl md:w-[104px] md:h-[104px]">
        <i className={`${icon} filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.301)]`}></i>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2">
        <h3 className="text-base font-semibold leading-tight sm:text-lg">{title}</h3>
        <p className="text-base leading-snug font-extrabold sm:text-lg">{desc}</p>
      </div>
    </div>
  );
}
