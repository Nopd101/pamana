export default function Footer() {
  return (
    <footer className="bg-[#3b2a1a] text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        
        <div>
          <h3 className="font-bold text-lg">PAMANA</h3>
          <p className="text-sm mt-2 opacity-80">
            Isang interaktibong platform para sa pag-aaral ng sinaunang
            kabihasnan.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Site Map</h4>
          <ul className="space-y-1 text-sm opacity-80">
            <li>Homepage</li>
            <li>Mga Aralin</li>
            <li>Mga Laro</li>
            <li>Profile</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm opacity-80">
            Bulacan State University<br />
            pamana@bulsu.edu.ph
          </p>
        </div>

      </div>

      <p className="text-center text-xs opacity-60 mt-8">
        © 2025 PAMANA. All rights reserved.
      </p>
    </footer>
  );
}
