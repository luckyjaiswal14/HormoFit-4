/**
 * HormoFit Nutrition Component
 * Food logging with hormonal impact scoring instead of just calories.
 */

import React, { useState } from 'react';
import { Camera, Search, Plus, Info, Apple, Flame, Zap, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FoodLog {
  id: string;
  name: string;
  impact: 'low' | 'medium' | 'high';
  score: number; // 0-100, higher is better for PCOD
  category: string;
  time: string;
}

export const Nutrition: React.FC = () => {
  const [logs, setLogs] = useState<FoodLog[]>([
    { id: '1', name: 'Oatmeal with Berries', impact: 'low', score: 85, category: 'Breakfast', time: '08:30 AM' },
    { id: '2', name: 'Grilled Chicken Salad', impact: 'low', score: 92, category: 'Lunch', time: '01:15 PM' },
    { id: '3', name: 'White Rice & Curry', impact: 'high', score: 45, category: 'Dinner', time: '08:00 PM' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMeal, setNewMeal] = useState({ name: '', category: 'Breakfast', score: 80 });
  const [showActivityFeedback, setShowActivityFeedback] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const handleAddMeal = () => {
    if (newMeal.name) {
      const impact = newMeal.score > 70 ? 'low' : newMeal.score > 40 ? 'medium' : 'high';
      const log: FoodLog = {
        id: Date.now().toString(),
        name: newMeal.name,
        category: newMeal.category,
        score: newMeal.score,
        impact: impact as any,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setLogs([log, ...logs]);
      setIsAdding(false);
      setNewMeal({ name: '', category: 'Breakfast', score: 80 });
    }
  };

  const averageHormonalScore = Math.round(logs.reduce((acc, log) => acc + log.score, 0) / logs.length);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nutrition Intelligence</h1>
          <p className="text-slate-500 mt-1">Hormonal impact scoring for PCOD management.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={startCamera}
            className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <Camera className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            <Plus className="w-5 h-5" /> Log Meal
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Daily Hormonal Score</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">{averageHormonalScore}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Insulin Spike Risk</h3>
          <p className="text-3xl font-bold text-amber-600 mt-1">Medium</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Metabolic Adherence</h3>
          <p className="text-3xl font-bold text-rose-600 mt-1">82%</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Search for PCOD-friendly foods..."
          className="w-full p-4 pl-12 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Log History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 px-2">Today's Meals</h2>
        <div className="space-y-3">
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  log.impact === 'low' ? 'bg-emerald-50 text-emerald-600' :
                  log.impact === 'medium' ? 'bg-amber-50 text-amber-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  <Apple className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{log.name}</h4>
                  <p className="text-xs text-slate-500">{log.category} • {log.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-bold ${
                    log.score > 80 ? 'text-emerald-600' :
                    log.score > 50 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>{log.score}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Impact Score</p>
                </div>
                <div className="w-1 h-10 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`w-full rounded-full ${
                      log.score > 80 ? 'bg-emerald-500' :
                      log.score > 50 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ height: `${log.score}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="bg-rose-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-rose-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Smart Recommendation</h3>
          <p className="text-rose-100 leading-relaxed">
            Your dinner had a high glycemic impact. We recommend a 15-minute brisk walk now to stabilize your insulin levels before sleep.
          </p>
          <button 
            onClick={() => {
              setShowActivityFeedback(true);
              setTimeout(() => setShowActivityFeedback(false), 3000);
            }}
            className="mt-6 bg-white text-rose-600 px-6 py-2.5 rounded-xl font-bold hover:bg-rose-50 transition-colors"
          >
            Start Activity
          </button>
        </div>
      </div>

      {/* Log Meal Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">Log Meal</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Meal Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Avocado Toast"
                      className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Category</label>
                    <select 
                      className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500"
                      value={newMeal.category}
                      onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })}
                    >
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Snack</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hormonal Score (0-100)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100"
                      className="w-full mt-4 accent-emerald-600"
                      value={newMeal.score}
                      onChange={(e) => setNewMeal({ ...newMeal, score: parseInt(e.target.value) })}
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-1">
                      <span>LOW IMPACT</span>
                      <span className="text-emerald-600">{newMeal.score}</span>
                      <span>HIGH IMPACT</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddMeal}
                    className="flex-1 py-4 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                  >
                    Save Meal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scan Food Modal */}
      <AnimatePresence>
        {isScanning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScanning(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">Scan Food</h3>
                  <button onClick={stopCamera} className="text-slate-400 hover:text-slate-600">
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>
                
                <div className="aspect-square bg-slate-900 rounded-[32px] overflow-hidden relative group">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-emerald-500/50 m-12 rounded-2xl animate-pulse pointer-events-none" />
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs font-bold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    Align food within frame
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-500 text-center text-sm">
                    AI will automatically detect ingredients and calculate hormonal impact.
                  </p>
                  <button 
                    onClick={() => {
                      stopCamera();
                      setIsAdding(true);
                      setNewMeal({ ...newMeal, name: 'Detected: Quinoa Salad' });
                    }}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                  >
                    Capture & Analyze
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activity Feedback Toast */}
      <AnimatePresence>
        {showActivityFeedback && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <Zap className="w-5 h-5 text-emerald-400" />
            <span className="font-bold">Activity Started! Tracking metabolic impact...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
