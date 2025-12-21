export default function FeatureCard({ title, desc }) {
  return (
    <div className="w-48 bg-[#8b4f2e] text-white rounded-xl p-5 text-center shadow-lg">
      <div className="h-12 w-12 bg-white/30 rounded-full mx-auto mb-4" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs mt-2 opacity-90">{desc}</p>
    </div>
  );
}
