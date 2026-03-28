/**
 * HormoFit Main Layout Component
 * Sidebar and navigation for the application.
 */

import React from 'react';
import { Activity, LayoutDashboard, Calendar, Apple, Brain, MessageSquare, LogOut, User, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName?: string | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, userName }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tracker', icon: Calendar, label: 'Cycle Tracker' },
    { id: 'nutrition', icon: Apple, label: 'Nutrition' },
    { id: 'mental', icon: Brain, label: 'Well-being' },
    { id: 'community', icon: MessageSquare, label: 'Community' },
  ];

  return (
    <div className="flex min-h-screen bg-rose-50/30">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-rose-100 flex flex-col p-8 fixed h-full z-40">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-100">
            <Activity className="w-7 h-7" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-rose-950">HormoFit</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                  : 'text-rose-400 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              <item.icon className="w-6 h-6" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-rose-100 space-y-2">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'settings' 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                : 'text-rose-400 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <Settings className="w-6 h-6" />
            Settings
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-6 h-6" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 min-h-screen">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-rose-100 px-12 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Welcome back,</p>
              <p className="font-bold text-rose-950">{userName || 'User'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Twin Sync Active
            </div>
          </div>
        </header>

        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
