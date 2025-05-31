import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import BodyModel from './components/BodyModel';
import DiagnosisPage from './components/DiagnosisPage';
import FeedbackPage from './components/FeedbackPage';
import useSound from 'use-sound';
import pingSound from './sounds/ping.mp3'; // You'll need to add these sound files
import './styles.css';


function Home() {
  const [selectedParts, setSelectedParts] = useState([]);
  const [painType, setPainType] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(1);
  const [additional, setAdditional] = useState('');
  const [extraDetails, setExtraDetails] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const canvasRef = useRef();

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 300);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const handlePartClick = (partName) => {
    setSelectedParts((prev) => {
      if (prev.includes(partName)) {
        return prev.filter((part) => part !== partName);
      } else {
        return [...prev, partName];
      }
    });
    setError(null);
  };

  const handleNext = async () => {
    if (selectedParts.length === 0) {
      setError('Please select at least one body part.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        locations: selectedParts,
        painType: painType || 'unspecified',
        duration: duration || 'unknown',
        severity: severity || 1,
        additional: additional || 'none',
        extraDetails: extraDetails || 'none',
        medicalHistory: medicalHistory || 'none',
        age: age || 'unspecified',
        gender: gender || 'unspecified',
        followUpAnswer: followUpAnswer || 'unspecified',
      };
      console.log('Sending diagnosis request:', payload);
      const response = await fetch('http://localhost:5001/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Backend error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Diagnosis received:', data);
      setProgress(100);
      navigate('/diagnosis', { state: { diagnosis: data.diagnosis, recommendations: data.recommendations } });
    } catch (err) {
      console.error('Diagnosis error:', err);
      setError(`Failed to get diagnosis: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-2/5 h-full border-2 border-gray-200 rounded-lg m-2 shadow-sm">
        <div className="text-center text-gray-700 font-semibold text-lg mt-1">3D Human Body Model</div>
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 100 }}
          gl={{ antialias: true }}
          shadows
          onCreated={() => console.log('Canvas initialized')}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 10]} intensity={0} castShadow />
          <Environment preset="studio" />
          <BodyModel onPartClick={handlePartClick} selectedParts={selectedParts} />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            target={[0, 0, 0]}
            minDistance={2}
            maxDistance={15}
          />
        </Canvas>
      </div>
      <div className="w-3/5 p-4 m-2 border-2 border-gray-200 rounded-lg flex flex-col space-y-2 shadow-sm">
        <div className="text-gray-700 font-semibold text-lg">Fill the form</div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-gray-700 font-medium text-sm">Body Parts</span>
            <input
              type="text"
              value={selectedParts.map(part => part.replace(/_/g, ' ')).join(', ')}
              readOnly
              placeholder="Click model to select"
              className="mt-1 w-full p-1.5 border border-gray-200 rounded-md bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium text-sm">Pain Type</span>
            <input
              type="text"
              value={painType}
              onChange={(e) => setPainType(e.target.value)}
              placeholder="e.g., sharp, dull"
              className="mt-1 w-full p-1.5 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium text-sm">Duration ( Days )</span>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2 days"
              className="mt-1 w-full p-1.5 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium text-sm">Pain Severity (1-10)</span>
            <div className="flex items-center mt-1">
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-gray-700 font-medium text-sm">{severity}</span>
            </div>
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium text-sm">Age</span>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 30"
              className="mt-1 w-full p-1.5 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium text-sm">Gender</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full p-1.5 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          {selectedParts.length > 0 && (
            <label className="block">
              <span className="text-gray-700 font-medium text-sm">Does the pain worsen with movement?</span>
              <select
                value={followUpAnswer}
                onChange={(e) => setFollowUpAnswer(e.target.value)}
                className="mt-1 w-full p-1.5 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
              >
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
          )}
          <label className="block">
            <span className="text-gray-700 font-medium text-sm">Additional Symptoms</span>
            <input
              type="text"
              value={additional}
              onChange={(e) => setAdditional(e.target.value)}
              placeholder="e.g., swelling"
              className="mt-1 w-full p-1.5 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium text-sm">Extra Details</span>
            <textarea
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              placeholder="e.g., swelling, redness"
              className="mt-1 w-full p-1.5 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 h-10 resize-none shadow-sm"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium text-sm">Medical History</span>
            <textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder="e.g., previous injuries, chronic conditions"
              className="mt-1 w-full p-1.5 border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 h-10 resize-none shadow-sm"
            />
          </label>
        </div>
        {isLoading && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`w-full p-2 mt-2 rounded-md font-medium transition-all duration-300 shadow-sm border-2 border-black
        ${
           isLoading 
           ? 'bg-gray-400 border-gray-400 text-gray-700 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-white hover:text-black active:bg-white active:text-black'
       }`}
        >
          {isLoading ? 'Loading...' : 'Next'}
        </button>
        {error && <p className="mt-1 text-red-600 font-medium text-sm">{error}</p>}
      </div>
    </div>
  );
}

function SplashScreen({ onComplete }) {
  const [playPing] = useSound(pingSound, { volume: 0.5 });
  
  const [showText, setShowText] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowText(true);
      playPing(); // Play ping when main text appears
    }, 500);
    
    const timer2 = setTimeout(() => {
      setShowSubtext(true);
      playPing(); // Play ping again when subtext appears
    }, 1500);
    
    const timer3 = setTimeout(() => {
      onComplete();
    }, 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete, playPing]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="text-center">
        <h1 
          className={`text-5xl font-bold text-white mb-4 transition-all duration-1000 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          WellBot.AI
        </h1>
        <div 
          className={`text-xl text-blue-200 transition-all duration-1000 delay-500 ${showSubtext ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Tap • Type • Treat
        </div>
      </div>
    </div>
  );
}


// Add this to your App component
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    if (!showSplash) {
      const timer = setTimeout(() => setFadeIn(true), 100);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  return (
    <div className={darkMode ? "dark-theme" : ""}>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <div className={`transition-opacity duration-1000 ease-in ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/diagnosis" element={<DiagnosisPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}