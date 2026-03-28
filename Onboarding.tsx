/**
 * HormoFit Onboarding Component
 * AI-powered early PCOD risk detection and profile setup.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Activity, AlertCircle, Info, Camera } from 'lucide-react';
import { PhotoUpload } from './PhotoUpload';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: 25,
    height: 160,
    weight: 60,
    cycleRegularity: 'regular',
    symptoms: [] as string[],
    exercise: 'moderate',
    diet: 'medium',
    photo: null as File | null,
  });

  const totalSteps = 5;

  const nextStep = () => setStep(s => Math.min(totalSteps, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const toggleSymptom = (s: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s) 
        ? prev.symptoms.filter(item => item !== s)
        : [...prev.symptoms, s]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl shadow-rose-100 overflow-hidden border border-slate-100">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full flex">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i}
              className={`h-full transition-all duration-500 ${i < step ? 'bg-rose-600' : 'bg-transparent'}`}
              style={{ width: `${100 / totalSteps}%` }}
            />
          ))}
        </div>

        <div className="p-12 space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-bold text-slate-900">Welcome to HormoFit</h2>
                  <p className="text-slate-500 mt-2 text-lg">Let's start by setting up your basic profile.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Age</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 text-lg font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Height (cm)</label>
                    <input 
                      type="number" 
                      value={formData.height}
                      onChange={e => setFormData({ ...formData, height: parseInt(e.target.value) })}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 text-lg font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={e => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 text-lg font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-bold text-slate-900">Cycle Intelligence</h2>
                  <p className="text-slate-500 mt-2 text-lg">How regular are your menstrual cycles?</p>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 'regular', title: 'Regular', desc: 'Cycles are consistently 21-35 days apart.' },
                    { id: 'irregular', title: 'Irregular', desc: 'Cycles vary significantly in length or are often skipped.' },
                    { id: 'none', title: 'Absent', desc: 'No periods for 3+ months.' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setFormData({ ...formData, cycleRegularity: option.id })}
                      className={`w-full p-6 rounded-3xl text-left transition-all border-2 ${
                        formData.cycleRegularity === option.id 
                          ? 'bg-rose-50 border-rose-600 shadow-lg shadow-rose-100' 
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xl text-slate-900">{option.title}</h4>
                          <p className="text-slate-500 mt-1">{option.desc}</p>
                        </div>
                        {formData.cycleRegularity === option.id && <Check className="w-6 h-6 text-rose-600" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-bold text-slate-900">Symptom Cluster</h2>
                  <p className="text-slate-500 mt-2 text-lg">Select any symptoms you experience frequently.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'Acne', 'Hair Thinning', 'Excessive Hair Growth', 
                    'Weight Gain', 'Mood Swings', 'Fatigue', 
                    'Bloating', 'Pelvic Pain', 'Darkened Skin'
                  ].map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className={`p-4 rounded-2xl text-left transition-all border-2 ${
                        formData.symptoms.includes(s) 
                          ? 'bg-rose-50 border-rose-600 text-rose-700' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      } font-bold text-sm`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PhotoUpload 
                  onUpload={(file) => {
                    setFormData({ ...formData, photo: file });
                    nextStep();
                  }}
                  onSkip={nextStep}
                />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
                    <Activity className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900">Ready to Generate</h2>
                  <p className="text-slate-500 text-lg max-w-md mx-auto">
                    We'll now create your personalized Digital Twin and PCOD risk profile.
                  </p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
                  <Info className="w-6 h-6 text-rose-500 shrink-0" />
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This is an AI-powered assessment and not a medical diagnosis. Please consult a healthcare professional for clinical evaluation.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 pt-8 border-t border-slate-100">
            {step > 1 && step < totalSteps && (
              <button 
                onClick={prevStep}
                className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            )}
            {step < totalSteps && step !== 4 && (
              <button 
                onClick={nextStep}
                className="flex-1 px-8 py-4 rounded-2xl font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-rose-200"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            )}
            {step === totalSteps && (
              <button 
                onClick={() => onComplete(formData)}
                className="flex-1 px-8 py-4 rounded-2xl font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-rose-200"
              >
                Generate Digital Twin <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
