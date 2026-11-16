import React, { useState } from 'react';
import { leetcodeUsername } from '../../utils/codingApi';
import { X, Save, RotateCcw, ShieldCheck, Moon } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, setSettings }) {
  const [formData, setFormData] = useState({ ...settings });
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const leetcodeHandle = leetcodeUsername(formData.leetcodeHandle);
    if (leetcodeHandle && !/^[\w.-]{1,100}$/.test(leetcodeHandle)) {
      e.currentTarget.elements.leetcodeHandle.setCustomValidity('Enter a LeetCode username or profile URL.');
      e.currentTarget.reportValidity();
      return;
    }
    setSettings({ ...formData, leetcodeHandle });
    setFormData({ ...formData, leetcodeHandle });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all local storage data to initial defaults?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">System Settings</h2>
            <p className="text-xs text-slate-400">Configure personal handles, targets, and local data</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LeetCode Username</label>
              <input
                type="text"
                name="leetcodeHandle"
                placeholder="Username or profile URL"
                value={formData.leetcodeHandle}
                onChange={(e) => {
                  e.target.setCustomValidity('');
                  setFormData({ ...formData, leetcodeHandle: e.target.value });
                }}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Codeforces Handle</label>
              <input
                type="text"
                value={formData.codeforcesHandle}
                onChange={(e) => setFormData({ ...formData, codeforcesHandle: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Study Target (Hours)</label>
              <input
                type="number"
                min="1"
                max="16"
                step="0.5"
                value={formData.dailyTargetHours}
                onChange={(e) => setFormData({ ...formData, dailyTargetHours: parseFloat(e.target.value) || 1 })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Streak Minimum (Hours)</label>
              <input
                type="number"
                min="0.5"
                max="8"
                step="0.5"
                value={formData.streakMinHours}
                onChange={(e) => setFormData({ ...formData, streakMinHours: parseFloat(e.target.value) || 1 })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Local-First Browser Persistence</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All your assignments, focus sessions, and targets are securely stored in your local browser storage. No account or remote database needed.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Data</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savedMessage ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
