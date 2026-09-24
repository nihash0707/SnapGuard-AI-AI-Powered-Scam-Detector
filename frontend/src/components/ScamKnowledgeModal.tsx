import React from 'react';
import { ShieldAlert, X, AlertTriangle, Lock, Link, MessageSquare } from 'lucide-react';

interface ScamKnowledgeModalProps {
  onClose: () => void;
}

export const ScamKnowledgeModal: React.FC<ScamKnowledgeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Scam & Cyber Threat Knowledge Base</h2>
              <p className="text-xs text-slate-500 font-medium">Understand common digital traps and how SnapGuard AI protects you.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Key Educational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Bank & KYC Phishing */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 text-red-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>1. Bank Account & KYC Suspension Scams</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Scammers send fake SMS alerts claiming your bank account (SBI, HDFC, ICICI, Chase) is locked or deactivated.
              They include urgent links asking you to update KYC or enter OTPs.
            </p>
            <div className="p-3 rounded-2xl bg-red-100/60 border border-red-200 text-[11px] text-red-900 font-mono font-bold">
              ❌ "Your account will be suspended today. Update KYC at http://sbi-kyc-fix.xyz"
            </div>
          </div>

          {/* Card 2: Brand Typosquatting */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm">
              <Link className="w-4 h-4 text-purple-600" />
              <span>2. Typosquatting & Fake Domains</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Typosquatting replaces characters in official brand names (e.g., replacing 'l' with '1' or 'o' with '0') to look genuine at a glance.
            </p>
            <div className="p-3 rounded-2xl bg-purple-100/60 border border-purple-200 text-[11px] text-purple-900 font-mono font-bold">
              ❌ Genuine: <code>paypal.com</code> vs Fake: <code>paypa1-security-check.com</code>
            </div>
          </div>

          {/* Card 3: Reverse QR Code Scams */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>3. Reverse QR Code & OTP Theft</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Scammers on OLX, WhatsApp, or Telegram send QR codes claiming it will "deposit money" into your account.
              Scanning a QR code or entering an OTP always AUTHORIZES PAYMENT out of your account.
            </p>
            <div className="p-3 rounded-2xl bg-amber-100/60 border border-amber-200 text-[11px] text-amber-900 font-mono font-bold">
              💡 Remember: You NEVER enter a PIN or scan a QR code to RECEIVE money.
            </div>
          </div>

          {/* Card 4: On-Device Protection */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>4. How SnapGuard AI Keeps You Safe</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              SnapGuard AI evaluates message text, URLs, and screenshots right on your Qualcomm Snapdragon / Windows device.
              No private texts are transmitted to external servers.
            </p>
            <div className="p-3 rounded-2xl bg-emerald-100/60 border border-emerald-200 text-[11px] text-emerald-900 font-mono font-bold">
              🔒 100% On-Device Heuristics & Local AI Inference
            </div>
          </div>

        </div>

        {/* Bottom Action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs shadow-lg shadow-blue-500/20 transition-all"
          >
            Got It! Close Knowledge Base
          </button>
        </div>

      </div>
    </div>
  );
};
