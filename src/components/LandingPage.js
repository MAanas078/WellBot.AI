import { useEffect, useRef } from 'react';
import AboutSection from './AboutSection';
import SurveyReport from './SurveyReport';
import AccuracySection from './AccuracySection';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import gifBackground from '../assets/animated.gif';

const LandingPage = () => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const requestRef = useRef();
  const animationSpeed = 1;
  const bgRef = useRef(null);

  const stories = [
    {
      title: 'Aman, 24 - Early Detection',
      content: 'WellBot.AI identified unusual symptoms in Aman and helped him seek medical attention just in time.',
    },
    {
      title: 'Riya, 32 - Quick Relief',
      content: 'Riya got instant insights about her severe back pain, saving hours of hospital wait time.',
    },
    {
      title: 'Vikram, 45 - Trusted Diagnosis',
      content: 'WellBot.AI gave Vikram an accurate and detailed report, confirmed later by doctors.',
    }
  ];

  // Double the array for seamless looping
  const duplicatedStories = [...stories, ...stories];

  useEffect(() => {
    // Animate background gradient
    let hue = 0;
    const animateBg = () => {
      hue = (hue + 0.5) % 360;
      bgRef.current.style.background = `
        radial-gradient(
          circle at center,
          hsl(${hue}, 80%, 5%) 0%,
          hsl(${(hue + 60) % 360}, 80%, 3%) 100%
      `;
      requestAnimationFrame(animateBg);
    };
    animateBg();

    // Animate stories track
    const track = trackRef.current;
    let position = 0;
    const cardWidth = 300;
    const gap = 24;

    const animateTrack = () => {
      position -= animationSpeed;
      if (position <= -((cardWidth + gap) * stories.length)) {
        position = 0;
      }
      track.style.transform = `translateX(${position}px)`;
      requestRef.current = requestAnimationFrame(animateTrack);
    };
    requestRef.current = requestAnimationFrame(animateTrack);

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div 
      className="w-full overflow-hidden bg-black"
      ref={bgRef}
      style={{
        background: 'radial-gradient(circle at center, hsl(0, 80%, 5%) 0%, hsl(60, 80%, 3%) 100%)'
      }}
    >
      {/* --- Hero Section with Animated GIF --- */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Animated GIF Background */}
        <img
          src={gifBackground}
          alt="Animated Background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
          style={{
            filter: 'brightness(0.6) contrast(1.2) saturate(1.1)'
          }}
        />
        
        {/* Neon Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/30 z-1"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-neon opacity-30 z-1"></div>

        {/* Hero Content */}
        <div className="relative z-20 h-full text-white flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            WellBot.AI
          </h1>

          <div className="text-2xl md:text-3xl mb-10 font-medium text-cyan-300">
            <Typewriter
              options={{
                strings: ['Your AI Healthcare Assistant', 'Empowering Medical Diagnosis', 'Future of Health.'],
                autoStart: true,
                loop: true,
              }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="bg-gradient-to-r from-cyan-600 to-blue-800 px-8 py-4 rounded-full text-white hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/feedback')}
              className="border-2 border-cyan-400 px-8 py-4 rounded-full text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40"
            >
              Know More
            </button>
          </div>
        </div>
      </div>

      {/* --- About Section --- */}
      <div className="w-full max-w-6xl mx-auto px-4 py-10 relative z-10">
        <div className="backdrop-blur-sm bg-black/50 p-8 rounded-2xl border border-cyan-900/50">
          <h2 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            About WellBot.AI
          </h2>
          
          <h3 className="text-2xl font-semibold mb-6 text-cyan-300">Real Stories</h3>
          
          <div className="stories-container relative h-80 overflow-hidden py-4">
            <div 
              ref={trackRef}
              className="stories-track absolute flex gap-6"
              style={{ width: `${(300 + 24) * duplicatedStories.length}px` }}
            >
              {duplicatedStories.map((story, index) => (
                <div 
                  key={`${story.title}-${index}`}
                  className="neon-card bg-gray-900/80 p-6 rounded-xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300"
                  style={{
                    width: '300px',
                    flexShrink: 0,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <h4 className="text-lg font-bold mb-2 text-cyan-300">{story.title}</h4>
                  <p className="text-gray-200">{story.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* --- Survey Report --- */}
          <div className="bg-gray-900/50 p-6 rounded-xl mb-10 border border-cyan-900/50 mt-12">
            <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Survey Report</h3>
            <p className="text-gray-300 mb-3">
              According to a recent survey of 1000+ users:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-200">
                <span className="text-cyan-400 mr-2">💬</span> 92% found the diagnosis highly relevant.
              </li>
              <li className="flex items-center text-gray-200">
                <span className="text-cyan-400 mr-2">⚡</span> 85% received a response under 5 seconds.
              </li>
              <li className="flex items-center text-gray-200">
                <span className="text-cyan-400 mr-2">❤️</span> 97% would recommend WellBot.AI to others.
              </li>
            </ul>
          </div>

          {/* --- Accuracy Info --- */}
          <div className="bg-gray-900/50 p-6 rounded-xl border border-cyan-900/50">
            <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Why It's Accurate</h3>
            <p className="text-gray-300 mb-4">
              WellBot.AI uses advanced Natural Language Processing and Machine Learning models trained on thousands of
              real-world medical cases. The system adapts and improves with every user interaction to provide you with:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-200">
                <span className="text-cyan-400 mr-2">✔️</span> Personalized recommendations based on symptoms and history
              </li>
              <li className="flex items-start text-gray-200">
                <span className="text-cyan-400 mr-2">✔️</span> 24x7 AI-driven triage system
              </li>
              <li className="flex items-start text-gray-200">
                <span className="text-cyan-400 mr-2">✔️</span> Real-time accuracy improvement via feedback loop
              </li>
            </ul>
          </div>
        </div>
      </div>

      <AboutSection />
      <SurveyReport />
      <AccuracySection />
    </div>
  );
};

export default LandingPage;