'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type PPEType = 'none' | 'gloves' | 'mask' | 'suit' | 'full';

interface PPESelectionPanelProps {
  currentPPE: PPEType;
  onPPESelect: (ppe: PPEType) => void;
  isOpen: boolean;
  onClose: () => void;
  requiredPPE?: PPEType;
}

const ppeOptions = [
  { id: 'none', name: 'None', description: 'No protection', icon: '❌', color: 'bg-red-600' },
  { id: 'gloves', name: 'Gloves', description: 'Hand protection', icon: '🧤', color: 'bg-blue-600' },
  { id: 'mask', name: 'Respirator', description: 'Respiratory protection', icon: '😷', color: 'bg-green-600' },
  { id: 'suit', name: 'Hazmat Suit', description: 'Full body protection', icon: '👔', color: 'bg-purple-600' },
  { id: 'full', name: 'Full Gear', description: 'Maximum protection', icon: '🛡️', color: 'bg-indigo-600' },
] as const;

export default function PPESelectionPanel({
  currentPPE,
  onPPESelect,
  isOpen,
  onClose,
  requiredPPE,
}: PPESelectionPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-w-[90vw]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-500/30 rounded-xl shadow-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <h2 className="text-lg font-bold text-white">Personal Protective Equipment</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Required PPE Alert */}
              {requiredPPE && requiredPPE !== 'none' && (
                <motion.div
                  className="mb-4 flex items-start gap-2 p-3 bg-yellow-950/40 border border-yellow-500/50 rounded-lg"
                  animate={{ borderColor: ['rgba(234, 179, 8, 0.5)', 'rgba(234, 179, 8, 0.8)', 'rgba(234, 179, 8, 0.5)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-200">
                    This task requires <strong>{requiredPPE.toUpperCase()}</strong> protection.
                  </p>
                </motion.div>
              )}

              {/* PPE Options Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {ppeOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => {
                      onPPESelect(option.id as PPEType);
                      onClose();
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-center group ${
                      currentPPE === option.id
                        ? `${option.color} border-white/80 shadow-lg`
                        : 'bg-slate-700/50 border-slate-600 hover:border-blue-500/60'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <p className={`font-semibold text-sm ${currentPPE === option.id ? 'text-white' : 'text-gray-300'}`}>
                      {option.name}
                    </p>
                    <p className={`text-xs ${currentPPE === option.id ? 'text-white/80' : 'text-gray-400'}`}>
                      {option.description}
                    </p>
                    {currentPPE === option.id && (
                      <motion.div
                        className="mt-2 inline-block px-2 py-0.5 bg-white/20 rounded text-xs font-semibold"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ✓ Selected
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Info Box */}
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200">
                <p className="font-semibold mb-1">⚠ PPE Importance:</p>
                <p>
                  Proper protection is critical when handling ammonia gases. Select appropriate gear before approaching hazardous areas.
                </p>
              </div>

              {/* Close Button */}
              <Button
                onClick={onClose}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                Confirm & Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
