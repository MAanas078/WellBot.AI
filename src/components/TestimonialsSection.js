// TestimonialsSection.js

import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Family Physician",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face&auto=format",
    rating: 5,
    text: "WellBot.AI has revolutionized how I provide preliminary assessments. The AI's accuracy is remarkable and helps me make better-informed decisions for my patients."
  },
  {
    name: "Michael Chen",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
    rating: 5,
    text: "I was skeptical at first, but WellBot.AI correctly identified my symptoms and recommended I see a specialist. It potentially saved my life by catching early warning signs."
  },
  {
    name: "Lisa Rodriguez",
    role: "Nurse Practitioner",
    image: "https://images.unsplash.com/photo-1594824475317-82cefc6a8299?w=150&h=150&fit=crop&crop=face&auto=format",
    rating: 5,
    text: "The diagnostic suggestions are incredibly detailed and help me prepare better for patient consultations. It's like having a medical encyclopedia that thinks."
  },
  {
    name: "David Kim",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
    rating: 5,
    text: "As someone living in a rural area with limited access to specialists, WellBot.AI provides peace of mind and guidance when I need it most."
  },
  {
    name: "Dr. Emily Watson",
    role: "Emergency Medicine",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face&auto=format",
    rating: 5,
    text: "The speed and accuracy of WellBot.AI's triage recommendations have improved our emergency department efficiency significantly."
  },
  {
    name: "James Thompson",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format",
    rating: 5,
    text: "WellBot.AI helped me understand my chronic condition better and provided valuable insights between doctor visits."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-slate-50" aria-labelledby="testimonials-title">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 id="testimonials-title" className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Trusted by Healthcare Professionals & Patients
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See what medical professionals and patients are saying about their experience with our AI-powered healthcare assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(({ name, role, image, rating, text }, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100 relative group"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-200 group-hover:text-blue-300 transition-colors" />
              
              <div className="flex items-center mb-6">
                <img
                  src={image}
                  alt={`Photo of ${name}`}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{name}</h4>
                  <p className="text-blue-600 font-medium">{role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {Array.from({ length: rating }, (_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-slate-700 leading-relaxed italic">"{text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
