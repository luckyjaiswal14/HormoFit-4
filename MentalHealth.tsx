/**
 * HormoFit Mental Health Component
 * Journaling and mood tracking linked to hormonal health.
 */

import React, { useState } from 'react';
import { Smile, Frown, Meh, Plus, Search, BookOpen, Brain, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JournalEntry {
  id: string;
  date: string;
  mood: 'happy' | 'neutral' | 'sad';
  content: string;
  tags: string[];
}

export const MentalHealth: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: '1', date: 'Today', mood: 'happy', content: 'Feeling much more energetic today after my morning workout. My skin is also clearing up!', tags: ['Energy', 'Skin'] },
    { id: '2', date: 'Yesterday', mood: 'neutral', content: 'A bit stressed with work, but managed to stick to my diet. Feeling slightly bloated.', tags: ['Stress', 'Bloating'] },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ mood: 'neutral', content: '', tags: [] as string[] });

  const handleAddEntry = () => {
    if (newEntry.content) {
      const log: JournalEntry = {
        id: Date.now().toString(),
        date: 'Today',
        mood: newEntry.mood as any,
        content: newEntry.content,
        tags: newEntry.tags,
      };
      setEntries([log, ...entries]);
      setIsAdding(false);
      setNewEntry({ mood: 'neutral', content: '', tags: [] });
    }
  };

  const toggleTag = (tag: string) => {
    if (newEntry.tags.includes(tag)) {
      setNewEntry({ ...newEntry, tags: newEntry.tags.filter(t => t !== tag) });
    } else {
      setNewEntry({ ...newEntry, tags: [...newEntry.tags, tag] });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mental Well-being</h1>
          <p className="text-slate-500 mt-1">Stress tracking and emotional-hormonal correlation.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-pink-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200"
        >
          <Plus className="w-5 h-5" /> New Entry
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Stress Score</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">Low</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Mood Stability</h3>
          <p className="text-3xl font-bold text-pink-600 mt-1">85%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-medium text-sm">Mindfulness Streak</h3>
          <p className="text-3xl font-bold text-rose-600 mt-1">5 Days</p>
        </div>
      </div>

      {/* Journal History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 px-2">Recent Reflections</h2>
        <div className="space-y-4">
          {entries.map((entry) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    entry.mood === 'happy' ? 'bg-emerald-50 text-emerald-600' :
                    entry.mood === 'neutral' ? 'bg-amber-50 text-amber-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {entry.mood === 'happy' ? <Smile className="w-6 h-6" /> :
                     entry.mood === 'neutral' ? <Meh className="w-6 h-6" /> :
                     <Frown className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{entry.date}</h4>
                    <div className="flex gap-2 mt-1">
                      {entry.tags.map(t => (
                        <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <BookOpen className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-slate-600 leading-relaxed italic">"{entry.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stress Analyzer Card */}
      <div className="bg-pink-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-pink-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
            <Brain className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Stress-Hormone Correlation</h3>
            <p className="text-pink-100 leading-relaxed">
              We've noticed that your stress levels tend to spike 3 days before your cycle starts. This is common in PCOD. We've added a "Stress Relief" routine to your recommendations for next week.
            </p>
          </div>
        </div>
      </div>

      {/* New Entry Modal */}
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
                <h3 className="text-2xl font-bold text-slate-900">New Journal Entry</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">How are you feeling?</label>
                    <div className="flex justify-between gap-4 mt-2">
                      {[
                        { icon: Smile, mood: 'happy', color: 'text-emerald-600 bg-emerald-50' },
                        { icon: Meh, mood: 'neutral', color: 'text-amber-600 bg-amber-50' },
                        { icon: Frown, mood: 'sad', color: 'text-red-600 bg-red-50' }
                      ].map((m) => (
                        <button
                          key={m.mood}
                          onClick={() => setNewEntry({ ...newEntry, mood: m.mood })}
                          className={`flex-1 aspect-square rounded-2xl flex items-center justify-center transition-all ${
                            newEntry.mood === m.mood ? `${m.color} ring-2 ring-offset-2 ring-pink-500` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <m.icon className="w-8 h-8" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Reflection</label>
                    <textarea 
                      placeholder="Write your thoughts here..."
                      className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 min-h-[120px] resize-none"
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Energy', 'Skin', 'Stress', 'Bloating', 'Sleep', 'Cravings'].map((t) => (
                        <button
                          key={t}
                          onClick={() => toggleTag(t)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            newEntry.tags.includes(t) ? 'bg-pink-100 text-pink-700 border-pink-200' : 'bg-slate-50 text-slate-500 border-transparent'
                          } border`}
                        >
                          {t}
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
                    onClick={handleAddEntry}
                    className="flex-1 py-4 rounded-2xl font-bold bg-pink-600 text-white hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200"
                  >
                    Save Entry
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
