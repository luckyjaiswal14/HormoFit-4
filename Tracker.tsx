/**
 * HormoFit Tracker Component
 * Menstrual cycle and symptom tracking with PCOD-specific intelligence.
 */

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Droplets, Plus, Trash2, Info, AlertCircle } from 'lucide-react';
import { format, addDays, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface CycleLog {
  id: string;
  startDate: Date;
  endDate?: Date;
  symptoms: string[];
  flow: 'light' | 'medium' | 'heavy';
}

export const Tracker: React.FC = () => {
  const [logs, setLogs] = useState<CycleLog[]>([
    { id: '1', startDate: new Date(2024, 2, 1), endDate: new Date(2024, 2, 5), symptoms: ['Cramps', 'Bloating'], flow: 'medium' },
    { id: '2', startDate: new Date(2024, 1, 1), endDate: new Date(2024, 1, 6), symptoms: ['Headache'], flow: 'heavy' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newLog, setNewLog] = useState<Partial<CycleLog>>({
    startDate: new Date(),
    symptoms: [],
    flow: 'medium',
  });

  const averageCycleLength = logs.length > 1 
    ? Math.round(differenceInDays(logs[0].startDate, logs[1].startDate))
    : 28;

  const isIrregular = averageCycleLength > 35 || averageCycleLength < 21;

  const handleAddLog = () => {
    if (newLog.startDate) {
      setLogs([{ ...newLog, id: Date.now().toString() } as CycleLog, ...logs]);
      setIsAdding(false);
    }
  };

  const toggleSymptom = (symptom: string) => {
    const current = newLog.symptoms || [];
    if (current.includes(symptom)) {
      setNewLog({ ...newLog, symptoms: current.filter(s => s !== symptom) });
    } else {
      setNewLog({ ...newLog, symptoms: [...current, symptom] });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cycle Intelligence</h1>
          <p className="text-slate-500 mt-1">PCOD-aware tracking and pattern detection.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-rose-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
        >
          <Plus className="w-5 h-5" /> Log Cycle
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Avg Cycle Length</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">{averageCycleLength} Days</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Status</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className={`text-2xl font-bold ${isIrregular ? 'text-amber-600' : 'text-emerald-600'}`}>
              {isIrregular ? 'Irregular' : 'Regular'}
            </p>
            {isIrregular && <AlertCircle className="w-5 h-5 text-amber-500" />}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Info className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Next Prediction</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {logs.length > 0 ? format(addDays(logs[0].startDate, averageCycleLength), 'MMM dd') : 'N/A'}
          </p>
        </div>
      </div>

      {/* Log History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 px-2">Recent Logs</h2>
        <div className="space-y-3">
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                  <span className="text-[10px] font-bold uppercase">{format(log.startDate, 'MMM')}</span>
                  <span className="text-lg font-bold text-slate-700 leading-none">{format(log.startDate, 'dd')}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    {log.endDate ? `${differenceInDays(log.endDate, log.startDate) + 1} Day Period` : 'Started Today'}
                  </h4>
                  <div className="flex gap-2 mt-1">
                    {log.symptoms.map(s => (
                      <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  log.flow === 'light' ? 'bg-emerald-50 text-emerald-600' :
                  log.flow === 'medium' ? 'bg-rose-50 text-rose-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {log.flow.toUpperCase()}
                </span>
                <button 
                  onClick={() => setLogs(logs.filter(l => l.id !== log.id))}
                  className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Log Modal */}
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
                <h3 className="text-2xl font-bold text-slate-900">Log New Cycle</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500"
                      onChange={(e) => setNewLog({ ...newLog, startDate: new Date(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Flow Intensity</label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {['light', 'medium', 'heavy'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setNewLog({ ...newLog, flow: f as any })}
                          className={`py-3 rounded-xl font-bold text-sm transition-all ${
                            newLog.flow === f ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {f.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Symptoms</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Cramps', 'Bloating', 'Headache', 'Acne', 'Fatigue', 'Mood Swings'].map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSymptom(s)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            newLog.symptoms?.includes(s) ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-500 border-transparent'
                          } border`}
                        >
                          {s}
                        </button>
                      ))}
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
                    onClick={handleAddLog}
                    className="flex-1 py-4 rounded-2xl font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                  >
                    Save Log
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
