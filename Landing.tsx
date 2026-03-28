/**
 * HormoFit Landing Page Component
 * Explaining the PCOD Digital Twin concept and features.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Activity, Brain, Heart, ShieldCheck, Zap, ChevronRight, Droplets, Apple, MessageSquare } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">HormoFit</span>
          </div>
          <button 
            onClick={onStart}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" /> The World's First PCOD Digital Twin
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900">
              Predict. <br />
              <span className="text-rose-600">Simulate.</span> <br />
              Heal.
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
              HormoFit creates a living virtual model of your hormonal health to predict risk, simulate outcomes, and guide your lifestyle choices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onStart}
                className="bg-rose-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-rose-700 transition-all shadow-2xl shadow-rose-200 flex items-center justify-center gap-2 group"
              >
                Start Your Journey <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors">
                How it Works
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-rose-200 rounded-full blur-[120px] opacity-30 animate-pulse" />
            <div className="relative bg-white p-8 rounded-[48px] shadow-2xl border border-slate-100">
              <div className="aspect-square bg-slate-900 rounded-[32px] overflow-hidden flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Activity className="w-24 h-24 text-rose-500 mx-auto animate-pulse" />
                  <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Digital Twin Active</p>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stability</p>
                  <p className="text-2xl font-black text-slate-900">84%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Level</p>
                  <p className="text-2xl font-black text-emerald-600">Low</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black tracking-tight text-slate-900">A Preventive Healthcare OS</h2>
            <p className="text-lg text-slate-500">Six powerful engines working together to manage your hormonal health.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: 'Risk Detection', desc: 'AI-powered early detection of PCOD risk using non-invasive questions and wearables.', color: 'bg-rose-50 text-rose-600' },
              { icon: Brain, title: 'Digital Twin', desc: 'A virtual hormonal model that simulates how lifestyle choices impact your future health.', color: 'bg-pink-50 text-pink-600' },
              { icon: Droplets, title: 'Cycle Intelligence', desc: 'PCOD-aware tracking that understands irregular patterns and predicts flare-ups.', color: 'bg-rose-50 text-rose-600' },
              { icon: Apple, title: 'Nutrition Engine', desc: 'Food scored by hormonal response, not calories. Insulin spike predictions for every meal.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Heart, title: 'Stress Analyzer', desc: 'Tracks how emotions and stress levels correlate with your physical PCOD symptoms.', color: 'bg-amber-50 text-amber-600' },
              { icon: ShieldCheck, title: 'Trust Network', desc: 'AI-verified community where experts and users share evidence-backed knowledge.', color: 'bg-blue-50 text-blue-600' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-6 group transition-all hover:shadow-2xl hover:shadow-rose-100"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[64px] p-16 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">Ready to meet your <br /> Digital Twin?</h2>
            <p className="text-slate-400 text-xl max-w-xl mx-auto">
              Join thousands of women taking control of their hormonal health with HormoFit.
            </p>
            <button 
              onClick={onStart}
              className="bg-white text-slate-900 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-slate-100 transition-all shadow-2xl shadow-white/10"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">HormoFit</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-rose-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-rose-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-rose-600 transition-colors">Contact</a>
          </div>
          <p className="text-slate-400 text-sm">© 2024 HormoFit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
