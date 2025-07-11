import React from 'react';
import { Gauge, ActivitySquare, Stethoscope } from 'lucide-react';

const AccuracySection = () => {
  const metrics = [
    {
      icon: Gauge,
      label: "Overall Diagnostic Accuracy",
      value: 95.3,
      color: "from-green-400 to-green-500"
    },
    {
      icon: ActivitySquare,
      label: "Symptom Match Rate",
      value: 92.1,
      color: "from-blue-400 to-blue-500"
    },
    {
      icon: Stethoscope,
      label: "Treatment Recommendation Precision",
      value: 90.8,
      color: "from-purple-400 to-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Trusted Accuracy You Can Rely On
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            WellBot.AI is rigorously tested and benchmarked against clinical data to ensure every result meets high standards of medical precision.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition-all group border border-slate-200"
              >
                <div className="bg-slate-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-200 transition-colors">
                  <Icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{metric.label}</h3>
                <p className="text-3xl font-bold text-slate-900 mb-4">{metric.value}%</p>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${metric.color} h-3 rounded-full transition-all`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AccuracySection;
