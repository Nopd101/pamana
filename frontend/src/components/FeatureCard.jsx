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
      className={`w-[230px] h-[310px] rounded-[20px] p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white flex flex-col items-center gap-5 mx-4 mb-10 bg-gradient-to-b ${cardColor} lg:w-[200px] lg:h-[280px] lg:p-8 lg:mb-8 md:w-[150px] md:h-[240px] md:p-6 md:gap-3`}
    >
      <div className="w-[104px] h-[104px] bg-white rounded-[15px] flex items-center justify-center text-5xl text-[var(--icon-color)] shadow-[inset_0_6px_8px_rgba(0,0,0,0.349)] lg:w-[90px] lg:h-[90px] lg:text-4xl md:w-[70px] md:h-[70px] md:text-3xl">
        <i className={`${icon} filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.301)]`}></i>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <p className="text-lg leading-snug font-extrabold">{desc}</p>
      </div>
    </div>
  );
}
