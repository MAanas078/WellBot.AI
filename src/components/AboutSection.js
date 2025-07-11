import React, { useEffect, useRef } from 'react';
import { Brain, Shield, Clock, Users } from 'lucide-react';

const AboutSection = () => {
  const sectionRef = useRef(null);
  const featureRefs = useRef([]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnosis",
      description: "Advanced machine learning algorithms analyze symptoms and medical history to provide accurate diagnostic insights."
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your medical data is encrypted and secure. We follow HIPAA compliance standards to protect your information."
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Get immediate feedback and recommendations without waiting for appointments or long diagnostic processes."
    },
    {
      icon: Users,
      title: "Expert Backed",
      description: "Our AI is trained with data from medical professionals and validated by healthcare experts worldwide."
    }
  ];

  useEffect(() => {
    // Dynamic background animation
    let hue = 180; // Starting with cyan hue
    const animateBackground = () => {
      hue = (hue + 0.3) % 360;
      if (sectionRef.current) {
        sectionRef.current.style.background = `
          radial-gradient(
            circle at center,
            hsl(${hue}, 80%, 8%) 0%,
            hsl(${(hue + 60) % 360}, 80%, 5%) 100%
        `;
      }
      requestAnimationFrame(animateBackground);
    };
    animateBackground();

    // Intersection Observer for feature animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-neon-glow');
        }
      });
    }, { threshold: 0.1 });

    featureRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      featureRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, hsl(180, 80%, 8%) 0%, hsl(240, 80%, 5%) 100%)'
      }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-neon opacity-20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Why Choose WellBot.AI?
          </h2>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            We combine cutting-edge artificial intelligence with medical expertise 
            to deliver reliable, accessible healthcare guidance when you need it most.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                ref={el => featureRefs.current[index] = el}
                className="bg-gray-900/70 p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 backdrop-blur-sm"
                style={{
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  willChange: 'transform, box-shadow'
                }}
              >
                <div className="bg-gradient-to-br from-cyan-600/20 to-blue-800/30 w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:from-cyan-500/30 group-hover:to-blue-700/30">
                  <IconComponent className="w-8 h-8 text-cyan-300" />
                </div>
                <h3 className="text-xl font-bold text-cyan-100 mb-4">{feature.title}</h3>
                <p className="text-cyan-50/80 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;