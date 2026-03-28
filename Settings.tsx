/**
 * HormoFit Settings Component
 * User profile and application preferences.
 */

import React, { useState } from 'react';
import { User, Bell, Shield, Moon, HelpCircle, ChevronRight, CreditCard, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsProps {
  userName?: string | null;
  userEmail?: string | null;
}

export const Settings: React.FC<SettingsProps> = ({ userName, userEmail }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleItemClick = (label: string) => {
    setToastMsg(`${label} settings updated.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Information', value: userName || 'User' },
        { icon: Shield, label: 'Email', value: userEmail || '' },
        { icon: CreditCard, label: 'Subscription Plan', value: 'Premium' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', value: 'On' },
        { icon: Moon, label: 'Appearance', value: 'System' },
      ]
    },
    {
      title: 'Privacy & Support',
      items: [
        { icon: Shield, label: 'Privacy Policy', value: '' },
        { icon: HelpCircle, label: 'Help Center', value: '' },
      ]
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and app preferences.</p>
      </header>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">{section.title}</h2>
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <button 
                  key={itemIdx}
                  onClick={() => handleItemClick(item.label)}
                  className={`w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors ${
                    itemIdx !== section.items.length - 1 ? 'border-b border-slate-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.value && <span className="text-sm font-medium text-slate-400">{item.value}</span>}
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8">
        <button className="w-full py-4 rounded-2xl font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
          Delete Account
        </button>
        <p className="text-center text-xs text-slate-400 mt-4">HormoFit v1.0.4 • Made with care for hormonal health</p>
      </div>

      {/* Settings Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
