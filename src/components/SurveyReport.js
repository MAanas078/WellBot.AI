import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, Award, Heart } from 'lucide-react';

const SurveyReport = () => {
  const [counters, setCounters] = useState({
    accuracy: 0,
    recommendation: 0,
    resolution: 0,
    confidence: 0
  });

  const stats = [
    {
      icon: TrendingUp,
      percentage: counters.accuracy,
      description: "of users found our AI diagnosis helpful and accurate",
      emoji: "🎯",
      target: 95
    },
    {
      icon: Users,
      percentage: counters.recommendation,
      description: "would recommend WellBot.AI to family and friends",
      emoji: "👥",
      target: 92
    },
    {
      icon: Award,
      percentage: counters.resolution,
      description: "reported faster resolution of health concerns",
      emoji: "⚡",
      target: 88
    },
    {
      icon: Heart,
      percentage: counters.confidence,
      description: "felt more confident about their health decisions",
      emoji: "💪",
      target: 94
    }
  ];

  const highlights = [
    { icon: "✅", text: "Reduced average time to diagnosis by 60%" },
    { icon: "✅", text: "24/7 availability increased user satisfaction by 85%" },
    { icon: "✅", text: "Integration with healthcare providers improved care coordination" },
    { icon: "✅", text: "Multi-language support made healthcare accessible to diverse communities" },
    { icon: "✅", text: "Cost-effective solution reduced healthcare expenses for 78% of users" }
  ];

  useEffect(() => {
    const duration = 2000; // Animation duration in ms
    const startTime = Date.now();

    const animateCounters = () => {
      const progress = Math.min(1, (Date.now() - startTime) / duration);
      
      setCounters({
        accuracy: Math.floor(progress * 95),
        recommendation: Math.floor(progress * 92),
        resolution: Math.floor(progress * 88),
        confidence: Math.floor(progress * 94)
      });

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(document.getElementById('survey-section'));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="survey-section"
      className="py-20 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, hsl(240, 80%, 5%) 0%, hsl(220, 80%, 8%) 100%)'
      }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-neon opacity-20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Real Results from Real Users
          </h2>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            Based on a comprehensive survey of over 10,000 WellBot.AI users 
            conducted in 2024, here's what our community has to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gray-900/70 p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 backdrop-blur-sm group"
                style={{
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  willChange: 'transform, box-shadow'
                }}
              >
                <div className="text-4xl mb-4">{stat.emoji}</div>
                <div className="text-4xl md:text-5xl font-bold text-cyan-300 mb-3 transition-colors">
                  {stat.percentage}%
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full" 
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                <p className="text-cyan-100 font-medium leading-relaxed">{stat.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-900/70 rounded-2xl p-8 md:p-12 border border-cyan-500/30 backdrop-blur-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-8 text-center">
            📊 Key Survey Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 rounded-xl bg-cyan-900/30 border border-cyan-400/20 hover:bg-cyan-800/40 transition-colors group"
              >
                <div className="text-cyan-300 text-lg flex-shrink-0 group-hover:text-cyan-200 transition-colors">
                  {highlight.icon}
                </div>
                <p className="text-cyan-100 font-medium">
                  {highlight.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-cyan-200/80 italic">
              Survey conducted by independent research firm Healthcare Analytics Inc. <br />
              Sample size: 10,247 users across 15 countries. Margin of error: ±2.1%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SurveyReport;