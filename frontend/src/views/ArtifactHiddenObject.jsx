import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bgHome from '../assets/bg-home.png';
import mainImage from '../assets/ArtifactHiddenObject/1.png';

const artifacts = [
  {
    name: 'TUTANKHAMEN MASK',
    hint: 'Gintong maskara ng batang pharaoh.',
    coords: { x: 8, y: 20, width: 22, height: 38 }, // in %
    found: false,
  },
  {
    name: 'SARCOPHAGUS',
    hint: 'Malaking kahon para sa libingan ng pharaoh.',
    coords: { x: 25, y: 48, width: 45, height: 22 }, // in %
    found: false,
  },
  {
    name: 'SCARAB',
    hint: 'Kadalasang gawa sa bato o precious stones.',
    coords: { x: 78, y: 84, width: 10, height: 10 }, // in %
    found: false,
  },
  {
    name: 'NILE RIVER MAP',
    hint: 'Ipinapakita ang ilog na pangunahing pinagkukunan ng tubig sa Egypt.',
    coords: { x: 45, y: 72, width: 18, height: 12 }, // in %
    found: false,
  },
  {
    name: 'CHARIOT',
    hint: 'Sinaunang karwaheng pandigma.',
    coords: { x: 70, y: 25, width: 20, height: 20 }, // in %
    found: false,
  },
];

const ArtifactHiddenObject = () => {
  const [foundItems, setFoundItems] = useState([]);
  const [activeHint, setActiveHint] = useState(null);
  const navigate = useNavigate();
  const imageContainerRef = useRef(null);

  const isGameFinished = foundItems.length === artifacts.length;

  const handleImageClick = (e) => {
    if (isGameFinished) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    artifacts.forEach((artifact) => {
      if (
        !foundItems.includes(artifact.name) &&
        x >= artifact.coords.x &&
        x <= artifact.coords.x + artifact.coords.width &&
        y >= artifact.coords.y &&
        y <= artifact.coords.y + artifact.coords.height
      ) {
        setFoundItems([...foundItems, artifact.name]);
        setActiveHint(null); // Hide hint once found
      }
    });
  };

  if (isGameFinished) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgHome})` }}>
        <div className="text-center bg-[#FDFBF7]/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-[#C8AA86]/50 max-w-lg w-full">
          <h2 className="text-5xl font-bold mb-4 text-[#5a2d0c]">Congratulations!</h2>
          <p className="text-3xl mb-8 text-[#5a2d0c]">
            You have found all the artifacts!
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#772402] text-white py-3 px-12 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-2xl"
          >
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4" style={{ backgroundImage: `url(${bgHome})` }}>
      <div className="w-full max-w-6xl mx-auto px-4 pb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#5a2d0c] font-bold mb-4 transition-transform hover:scale-[1.01] text-lg md:text-xl cursor-pointer"
        >
          <span className="mr-2">◀</span> Back
        </button>
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
            Artifact Hidden Object
          </h1>
          <p className="text-[#964B1D] font-bold text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            Tuklasin ang mga nakatagong kayamanan ng sinaunang Egypt. Bawat artifact ay may hint na makakatulong sa’yo.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div ref={imageContainerRef} onClick={handleImageClick} className="w-full md:w-3/4 relative cursor-pointer rounded-lg overflow-hidden shadow-lg border-4 border-[#7B3306]">
            <img src={mainImage} alt="Ancient Egyptian Tomb" className="w-full h-auto" />
            {artifacts.map((artifact) =>
              foundItems.includes(artifact.name) && (
                <div
                  key={artifact.name}
                  className="absolute border-4 border-yellow-400 rounded-full animate-ping"
                  style={{
                    left: `${artifact.coords.x + artifact.coords.width / 2}%`,
                    top: `${artifact.coords.y + artifact.coords.height / 2}%`,
                    width: '20px',
                    height: '20px',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )
            )}
          </div>

          <div className="w-full md:w-1/4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-4 border-[#7B3306]">
            <h3 className="text-2xl font-bold text-[#5a2d0c] mb-4 text-center">Items to Find</h3>
            <ul>
              {artifacts.map((artifact) => (
                <li
                  key={artifact.name}
                  onClick={() => !foundItems.includes(artifact.name) && setActiveHint(activeHint === artifact.name ? null : artifact.name)}
                  className={`p-2 my-1 rounded-md cursor-pointer transition-all ${
                    foundItems.includes(artifact.name)
                      ? 'bg-green-300 text-gray-500 line-through'
                      : 'bg-amber-100 hover:bg-amber-200'
                  }`}
                >
                  <p className="font-bold text-[#5a2d0c]">{artifact.name}</p>
                  {activeHint === artifact.name && (
                    <p className="text-sm italic text-amber-800 mt-1">{artifact.hint}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtifactHiddenObject;
