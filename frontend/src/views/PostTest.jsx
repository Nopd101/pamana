import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav';
import bgHome from '../assets/bg-home.png';

const questions = [
    {
        question: "Anong estrukturang ipinatayo ni Nebuchadnezzar II upang maibsan ang pangungulila ng kaniyang asawa sa kanilang tahanang lupain at kinilalang isa sa Sinaunang Seven Wonders?",
        options: ["Ishtar Gate", "Ziggurat of Ur", "Hanging Gardens", "Temple of Marduk"],
        answer: "Hanging Gardens"
    },
    {
        question: "Alin sa mga sumusunod ang tumutukoy sa sistema ng pagsulat na umunlad sa kabihasnang Egyptian?",
        options: ["Cuneiform", "Pictogram", "Hieroglyphics", "Calligraphy"],
        answer: "Hieroglyphics"
    },
    {
        question: "Alin sa mga grupong ito ang itinuturing na mga unang nanirahan sa India?",
        options: ["Aryan", "Dravidian", "Mongol", "Persian"],
        answer: "Dravidian"
    },
    {
        question: "Alin sa mga sumusunod ang pangunahing dahilan ng paglalagay o pagtatayo ng mga pyramid sa Egypt?",
        options: ["Tirahan ng mga mamamayan", "Pagsamba sa mga diyos", "Libingan ng mga pharaoh", "Sentro ng kalakalan"],
        answer: "Libingan ng mga pharaoh"
    },
    {
        question: "Alin sa mga sumusunod ang imperyong unang nagtagumpay sa pag-iisa ng iba’t ibang lungsod estado sa Mesopotamia sa pamumuno ni Sargon I?",
        options: ["Sumer", "Babylonia", "Akkad", "Assyria"],
        answer: "Akkad"
    },
    {
        question: "Ano ang katangian ng isang taong tinatawag na “Arya” sa Sanskrit?",
        options: ["Matalino", "Marangal", "Mandirigma", "Pari"],
        answer: "Marangal"
    },
    {
        question: "Saang rehiyon unang nabuo at umunlad ang kabihasnang Maya?",
        options: ["Nile Delta", "Andes Mountains", "Yucatan Peninsula", "Valley of Mexico"],
        answer: "Yucatan Peninsula"
    },
    {
        question: "Aling diyos ang kinikilala ng mga Aztec bilang diyos ng araw?",
        options: ["Kukulcan", "Inti", "Huitzilopochtli", "Quetzalcoatl"],
        answer: "Huitzilopochtli"
    },
    {
        question: "Batay sa pagsusuri ng iba’t ibang posibleng dahilan, alin sa mga sumusunod ang nagsasaad ng pinakanaaangkop na historikal na paliwanag sa pagbagsak ng Kabihasnang Indus?",
        options: ["Paglusob ng Aryan", "Pagbagsak ng ekonomiya", "Likas na kalamidad", "Pagkamatay ng hari"],
        answer: "Paglusob ng Aryan"
    },
    {
        question: "Ayon sa pagsusuri ng kanilang paniniwala at tradisyon, ano ang papel ng Vedas sa paghubog ng lipunang Aryan?",
        options: ["Naging batayan ng sistemang caste", "Nagdulot ng digmaan", "Pinag-isa ang mga Dravidian", "Nagpatibay ng kalakalan"],
        answer: "Naging batayan ng sistemang caste"
    },
    {
        question: "Paano naimpluwensyahan ng pananakop ng mga Hyksos ang kabihasnang Egyptian, partikular sa kanilang teknolohikal, militar, at kultural na aspeto?",
        options: ["Natutunan nila ang paggamit ng chariot", "Nawala ang hieroglyphics", "Nabuo ang bagong relihiyon", "Naging demokratiko ang pamahalaan"],
        answer: "Natutunan nila ang paggamit ng chariot"
    },
    {
        question: "Kung susuriin ang lokasyon at pamumuhay ng mga naunang tao rito, bakit itinuring ang Mesopotamia bilang 'lunduyan ng kabihasnan'?",
        options: ["Dahil lumaganap dito ang pinakamalalaking relihiyon", "Dahil nagkaroon ito ng sistematikong pamahalaan at sentrong lungsod", "Dahil ito ang unang nagtatag ng malawak na imperyo sa Asya", "Dahil ito ang naging pangunahing ruta ng mga manlalakbay"],
        answer: "Dahil nagkaroon ito ng sistematikong pamahalaan at sentrong lungsod"
    },
    {
        question: "Ano ang nagpapakita ng estratehikong pamamahala na nagbigay tagumpay sa mga Persiano sa pagpapalawak ng imperyo?",
        options: ["Pagtatalaga ng satrap na nagpapalakas ng pamamahala sa mga lalawigan", "Pagpapalawak ng lupain upang makakuha ng mas maraming likas na yaman", "Mahigpit na pagpapatupad ng kaparusahan sa sinumang sumuway sa hari", "Pagpapalaganap ng iisang relihiyon upang mapag-isa ang mamamayan"],
        answer: "Pagtatalaga ng satrap na nagpapalakas ng pamamahala sa mga lalawigan"
    },
    {
        question: "Ano ang pangunahing dahilan kung bakit naging estratehikong lokasyon ang Tenochtitlan sa lawa ng Texcoco?",
        options: ["Madaling tumakas ang mga mamamayan", "May matabang lupa para sa agrikultura", "Malayo ito sa kalakalan", "Madali itong sakupin"],
        answer: "May matabang lupa para sa agrikultura"
    },
    {
        question: "Kung gagawa ka ng isang makabagong modelo ng lipunan na hango sa konsepto ng caste ngunit walang diskriminasyon, alin sa mga sumusunod ang pinakaangkop na paraan upang ito’y maisabuhay?",
        options: ["Sa pagbibigay ng mas mataas na pribilehiyo sa mga Brahmin", "Sa pagpapanatili ng tradisyonal na paghihiwalay ng mga uri", "Sa paglikha ng programang pantay sa edukasyon at oportunidad", "Sa pagtatakda ng bagong antas batay sa yaman at kapangyarihan"],
        answer: "Sa paglikha ng programang pantay sa edukasyon at oportunidad"
    },
    {
        question: "Sa pag-aaral ng pamahalaang Han, ano ang naging epekto ng pilosopiyang Confucianism sa kanilang pamamalakad?",
        options: ["Nagpatibay ng batas militar", "Nagpalaganap ng digmaan", "Pagpasimula ng reporma sa agrikultura", "Nagpahalaga sa moralidad at edukasyon"],
        answer: "Nagpahalaga sa moralidad at edukasyon"
    },
    {
        question: "Sa pagdating ng mga Espanyol, aling bahagi ng kabihasnang Mesoamerican ang nakaranas ng pinakamatinding pagbabago?",
        options: ["Ang sistemang panlipunan ng mga mandirigmang Aztec", "Ang paggamit ng wikang katutubo sa araw-araw", "Ang ugnayang panrelihiyon at kapangyarihang pampolitika", "Ang paraan ng pagsasaka at pangangalakal lamang"],
        answer: "Ang ugnayang panrelihiyon at kapangyarihang pampolitika"
    },
    {
        question: "Batay sa kanilang mga imbensyon at kasanayang teknikal, paano ipinakita ng Dinastiyang Shang ang kanilang kabihasnang teknolohikal?",
        options: ["Pagtatatag ng kalendaryo", "Pagpapalaganap ng Buddhism", "Pagpapagawa ng pyramid", "Paggamit ng bronse at oracle bones"],
        answer: "Paggamit ng bronse at oracle bones"
    },
    {
        question: "Kung pagsasamahin ang lakas ng Akkadian at Assyrian sa isang modernong bansa, anong katangian ang dapat nilang paunlarin upang maging epektibong estado?",
        options: ["Pagbuo ng hukbong mabilis tumugon sa panganib at may malinaw na pamamahala", "Pagtutok sa paglikha ng batas na may iisang pinagmulan", "Pagpapalaganap ng kulturang pangkalakalan bago magpalakas ng military", "Pagtatalaga ng mga pinuno batay lamang sa kanilang relihiyon"],
        answer: "Pagbuo ng hukbong mabilis tumugon sa panganib at may malinaw na pamamahala"
    },
    {
        question: "Kung muling itatatag ang mga sinaunang kabihasnang Mesoamerican ngayon, aling aspeto ang mas makatutulong upang sila ay umunlad?",
        options: ["Pagbabalik sa paniniwala sa maraming diyos", "Sistemang agrikultural at kalakalan", "Relihiyong nakabatay sa pagsasakripisyo", "Pagtitiwala sa mga panlabas na mananakop"],
        answer: "Sistemang agrikultural at kalakalan"
    }
];

const PostTest = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(10);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const timerRef = React.useRef(null);

    const handleNextQuestion = (selectedAnswer) => {
        if (selectedAnswer === questions[currentIndex].answer) {
            setScore(prev => prev + 1);
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsGameFinished(true);
        }
    };

    useEffect(() => {
        setTimer(10); // Reset timer for new question
        if (timerRef.current) clearInterval(timerRef.current);

        if (!isGameFinished) {
            timerRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        handleNextQuestion(null); // Move to next question when timer ends
                        return 10;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [currentIndex, isGameFinished]);

    if (isGameFinished) {
        return (
            <div className="min-h-screen bg-cover bg-center font-[var(--font-body)] flex flex-col items-center justify-center" style={{ backgroundImage: `url(${bgHome})` }}>
                <Navbar />
                <div className="text-center bg-[#FDFBF7] rounded-3xl shadow-2xl p-10 border-4 border-[#C8AA86]/50">
                    <h2 className="text-4xl font-bold mb-4 text-[#5a2d0c]">Post-Test Complete!</h2>
                    <p className="text-2xl mb-6 text-[#5a2d0c]">
                        Your Final Score: <span className="font-extrabold">{score}/{questions.length}</span>
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#772402] text-white py-3 px-8 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-xl"
                    >
                        Finish
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = (timer / 10) * 100;

    return (
        <div className="min-h-screen bg-cover bg-center font-[var(--font-body)]" style={{ backgroundImage: `url(${bgHome})` }}>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen pt-24 md:pt-32">
                <div className="w-full max-w-4xl mx-auto px-4 pb-10">
                    <button onClick={() => navigate(-1)} className="flex items-center text-[#5a2d0c] font-bold mb-4 transition-transform hover:scale-[1.01] text-sm md:text-base cursor-pointer">
                        <span className="mr-2">◀</span> Back
                    </button>

                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-5xl font-black text-[#772402] mb-2 font-[var(--font-heading)] uppercase drop-shadow-sm">
                            Post-Test
                        </h1>
                        <p className="text-[#964B1D] font-bold text-xs md:text-base max-w-xl mx-auto leading-relaxed px-4">
                            Basahin ng mabuti ang bawat tanong. Mayroon kang 10 segundo bawat isa.
                        </p>
                    </div>

                    <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 relative flex flex-col items-center">
                        <div className="w-full max-w-3xl">
                            <div className="flex justify-between items-center mb-4 text-[#772402] font-bold">
                                <span>Question {currentIndex + 1} of {questions.length}</span>
                                <span>Score: {score}/{questions.length}</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-4 mb-6 border border-gray-300">
                                <div className="bg-gradient-to-r from-[#8B5E3C] to-[#C8AA86] h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s linear' }}></div>
                                <span className="absolute right-4 -mt-4 text-sm font-bold text-[#5a2d0c]">{timer}s</span>
                            </div>

                            <div className="bg-gradient-to-b from-[#8B5E3C] to-[#5a2d0c] rounded-xl p-6 md:p-10 shadow-inner mb-6 text-center flex flex-col justify-center min-h-[150px]">
                                <p className="text-white font-semibold text-lg md:text-xl leading-relaxed whitespace-pre-line drop-shadow-md">
                                    {currentQuestion.question}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNextQuestion(option)}
                                        className="bg-[#8B5E3C] text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-[#7a4e2c] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8AA86]"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostTest;
