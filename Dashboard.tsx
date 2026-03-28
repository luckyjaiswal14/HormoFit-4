/**
 * HormoFit Dashboard Component
 * Main view for the Digital Twin, charts, and recommendations.
 */

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Activity, Calendar, Droplets, Heart, Info, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { HealthState, HealthMetrics } from '../lib/healthEngine';
import { Recommendation } from '../lib/recommendationEngine';
import { PredictionPoint } from '../lib/predictionEngine';
import { DigitalTwin3D } from './DigitalTwin3D';

interface DashboardProps {
  state: HealthState;
  metrics: HealthMetrics;
  recommendations: Recommendation[];
  predictions: PredictionPoint[];
}

export const Dashboard: React.FC<DashboardProps> = ({ state, metrics, recommendations, predictions }) => {
  const radarData = useMemo(() => [
    { subject: 'Insulin', A: (10 - state.insulinResistanceScore) * 10, fullMark: 100 },
    { subject: 'Cycle', A: state.cycleRegularityScore * 10, fullMark: 100 },
    { subject: 'Stress', A: (10 - state.stressScore) * 10, fullMark: 100 },
    { subject: 'Inflammation', A: (10 - state.inflammationIndex) * 10, fullMark: 100 },
    { subject: 'Adherence', A: state.adherenceScore, fullMark: 100 },
  ], [state]);

  const stabilityColor = state.riskLevel === 'High' ? 'text-red-500' : state.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-rose-950">Digital Twin Overview</h1>
          <p className="text-rose-600/70 mt-1">Hormonal health analysis based on your latest data.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-rose-100">
          <div className={`w-3 h-3 rounded-full animate-pulse ${state.riskLevel === 'High' ? 'bg-red-500' : state.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'}`} />
          <span className="font-medium text-rose-900">{state.riskLevel} Risk Level</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Digital Twin & Charts */}
        <div className="lg:col-span-8 space-y-8">
          {/* Digital Twin 3D */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-[500px]"
          >
            <DigitalTwin3D state={state} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Radar Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-rose-100"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-rose-900">
                <Activity className="w-5 h-5 text-rose-500" />
                Hormonal Balance
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#fecdd3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#e11d48', fontSize: 12, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Health"
                      dataKey="A"
                      stroke="#f43f5e"
                      fill="#f43f5e"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Prediction Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-rose-100"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-rose-900">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                30-Day Prediction
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fff1f2" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#f43f5e', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#f43f5e', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                    />
                    <Line type="monotone" dataKey="stability" stroke="#f43f5e" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-xs font-medium text-rose-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-rose-500" /> Stability
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-emerald-500" /> Weight
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Stats & Recommendations */}
        <div className="lg:col-span-4 space-y-8">
          {/* Stability Score Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-rose-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16" />
            <h3 className="text-rose-600 font-medium mb-1">Stability Score</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl font-bold ${stabilityColor}`}>{Math.round(state.hormonalStabilityScore)}</span>
              <span className="text-rose-300 font-medium">/ 100</span>
            </div>
            <p className="text-rose-700/60 text-sm mt-4 leading-relaxed">
              Based on your insulin, cycle, and stress metrics. A higher score indicates better hormonal balance.
            </p>
          </motion.div>

          {/* Recommendations List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-rose-950 px-2">Daily Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-rose-100 flex gap-4 group hover:border-rose-300 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    rec.category === 'Nutrition' ? 'bg-emerald-50 text-emerald-600' :
                    rec.category === 'Lifestyle' ? 'bg-rose-50 text-rose-600' :
                    rec.category === 'Mental Health' ? 'bg-pink-50 text-pink-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {rec.category === 'Nutrition' ? <Heart className="w-5 h-5" /> :
                     rec.category === 'Lifestyle' ? <Activity className="w-5 h-5" /> :
                     rec.category === 'Mental Health' ? <Activity className="w-5 h-5" /> :
                     <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-rose-900">{rec.title}</h4>
                      {rec.priority === 'High' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 px-1.5 py-0.5 rounded">High</span>
                      )}
                    </div>
                    <p className="text-sm text-rose-700/60 mt-1 leading-snug">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
