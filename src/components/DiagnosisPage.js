import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import BodyModel from './BodyModel';
import axios from 'axios';

// Bold the condition name in diagnosis
const renderDiagnosis = (diagnosis) => {
  const regex = /\*\*(.*?)\*\*/;
  const match = diagnosis.match(regex);
  if (match && match[1]) {
    const condition = match[1];
    const parts = diagnosis.split(regex);
    return (
      <>
        {parts[0]}
        <strong>{condition}</strong>
        {parts[2]}
      </>
    );
  }
  return diagnosis;
};

// 🔊 Speak text in the correct language
const speakText = (text, langCode, setSpeechUtterance, setIsSpeaking) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  setSpeechUtterance(utterance);
  speechSynthesis.speak(utterance);
  setIsSpeaking(true);
};

// 🌐 Translate text using LibreTranslate API
const translateText = async (text, targetLang) => {
  try {
    const response = await axios.post(
      'https://libretranslate.com/translate',
      {
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
      },
      {
        headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
      }
    );
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export default function DiagnosisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const savedDiagnosis = JSON.parse(localStorage.getItem('diagnosis')) || {};
  const { diagnosis, recommendations } = location.state || savedDiagnosis || {
    diagnosis: 'No diagnosis available',
    recommendations: 'No recommendations available',
  };

  const [speechUtterance, setSpeechUtterance] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState('en');
  const [translatedDiagnosis, setTranslatedDiagnosis] = useState('');
  const [translatedRecommendations, setTranslatedRecommendations] = useState('');

  const handleBack = () => navigate('/');
  const handleFeedback = () => navigate('/feedback', { state: { diagnosis, recommendations } });

  // 🗣️ Speak according to selected language
  const handleSpeak = () => {
    const textToSpeak =
      language === 'hi'
        ? `निदान: ${translatedDiagnosis.replace(/\*\*/g, '')}. सिफारिशें: ${translatedRecommendations}`
        : `Diagnosis: ${diagnosis.replace(/\*\*/g, '')}. Recommendations: ${recommendations}`;
    const langCode = language === 'hi' ? 'hi-IN' : 'en-US';
    speakText(textToSpeak, langCode, setSpeechUtterance, setIsSpeaking);
  };

  const handlePause = () => {
    speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    speechSynthesis.resume();
    setIsPaused(false);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // Translate when language changes to Hindi
  useEffect(() => {
    const fetchTranslation = async () => {
      if (language === 'hi') {
        const translatedDiag = await translateText(diagnosis, 'hi');
        const translatedReco = await translateText(recommendations, 'hi');
        setTranslatedDiagnosis(translatedDiag);
        setTranslatedRecommendations(translatedReco);
      }
    };
    fetchTranslation();
  }, [language]);

  const showDiagnosis = language === 'hi' ? translatedDiagnosis : diagnosis;
  const showRecommendations = language === 'hi' ? translatedRecommendations : recommendations;

  return (
    <div className="flex flex-row w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-1/2 h-full border-2 border-gray-200 rounded-lg m-2 shadow-sm">
        <div className="text-center text-white-800 font-semibold text-lg mt-1">
          {language === 'hi' ? 'शरीर (केवल पढ़ने के लिए)' : '3D Human Body Model'}
        </div>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 100 }}
          gl={{ antialias: true }}
          shadows
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 10]} intensity={0} castShadow />
          <Environment preset="studio" />
          <BodyModel onPartClick={() => {}} selectedParts={[]} />
          <OrbitControls enableZoom enableRotate target={[0, 0, 0]} minDistance={2} maxDistance={15} />
        </Canvas>
      </div>

      <div className="w-1/2 p-4 m-2 border-2 border-gray-200 rounded-lg flex flex-col space-y-3 shadow-sm">
        <div className="flex flex-col space-y-3 flex-1">
          <div className="flex flex-row space-x-3">
            <div className="flex-1">
              <h2 className="text-white-800 font-semibold text-lg mb-1 border-b-2 border-gray-200 pb-1">
                {language === 'hi' ? 'निदान' : 'Diagnosis'}
              </h2>
              <div className="text-gray-600 text-sm">{renderDiagnosis(showDiagnosis)}</div>
            </div>
            <div className="flex-1 border-l-2 border-gray-200 pl-3">
              <h2 className="text-white-800 font-semibold text-lg mb-1 border-b-2 border-gray-200 pb-1">
                {language === 'hi' ? 'इसे कैसे ठीक करें' : 'Recommendations'}
              </h2>
              <div className="text-gray-600 text-sm">{showRecommendations}</div>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-xs italic mt-2">
          {language === 'hi'
            ? 'यह वेब ऐप विकास चरण में है [बनाया गया Zodrick John और Mohd Aanas द्वारा]'
            : 'This web app is in the developing phase [Made by Zodrick John & Mohd Aanas]'}
        </p>


        <div className="flex flex-row space-x-3 mt-3">
          <button onClick={handleBack} className="w-1/4 p-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition shadow-sm">
            {language === 'hi' ? 'वापस' : 'Back'}
          </button>

          <button onClick={handleFeedback} className="w-1/4 p-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition shadow-sm">
            {language === 'hi' ? 'प्रतिक्रिया' : 'Feedback'}
          </button>

          {isSpeaking ? (
            <button onClick={handleStop} className="w-1/4 p-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition shadow-sm">
              🛑 {language === 'hi' ? 'रुकें' : 'Stop'}
            </button>
          ) : (
            <button onClick={handleSpeak} className="w-1/4 p-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition shadow-sm">
              🔊 {language === 'hi' ? 'बोलें' : 'Speak'}
            </button>
          )}

          {isSpeaking && !isPaused ? (
            <button onClick={handlePause} className="w-1/4 p-2 bg-yellow-500 text-white rounded-md font-medium hover:bg-yellow-600 transition shadow-sm">
              ⏸️ {language === 'hi' ? 'रोकें' : 'Pause'}
            </button>
          ) : (
            isPaused && (
              <button onClick={handleResume} className="w-1/4 p-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition shadow-sm">
                ▶️ {language === 'hi' ? 'फिर से शुरू करें' : 'Resume'}
              </button>
            )
          )}
        </div>

      
      </div>
    </div>
  );
}
