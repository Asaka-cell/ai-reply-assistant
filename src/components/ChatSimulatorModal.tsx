import React, { useState } from 'react';
import { RelationshipType } from '../types';
import { RELATIONSHIPS } from '../constants/presets';
import { X, ChevronLeft, Phone, Search, Menu, Copy, Check, Send } from 'lucide-react';

interface ChatSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationship: RelationshipType;
  receivedMessage: string;
  replyText: string;
}

export const ChatSimulatorModal: React.FC<ChatSimulatorModalProps> = ({
  isOpen,
  onClose,
  relationship,
  receivedMessage,
  replyText,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const currentRel = RELATIONSHIPS.find((r) => r.id === relationship);
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(replyText);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <span>📱 LINEトーク画面イメージ</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LINE Header (Green or dark) */}
        <div className="bg-[#243545] text-white px-3 py-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:opacity-80"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentRel?.emoji || '👤'}</span>
              <div>
                <div className="font-bold text-sm tracking-tight">
                  {currentRel?.title || relationship}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">オンライン</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <Search className="w-4 h-4" />
            <Phone className="w-4 h-4" />
            <Menu className="w-4 h-4" />
          </div>
        </div>

        {/* LINE Chat Content (Classic LINE background) */}
        <div className="bg-[#8cabd9] flex-1 p-3.5 space-y-3.5 overflow-y-auto min-h-[300px] text-xs">
          {/* Date Separator */}
          <div className="flex justify-center">
            <span className="bg-black/20 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">
              今日
            </span>
          </div>

          {/* Incoming Message (Left Bubble) */}
          {receivedMessage && (
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base shadow-xs shrink-0 mt-0.5">
                {currentRel?.emoji || '👤'}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-700 font-medium ml-1">
                  {currentRel?.title || relationship}
                </span>
                <div className="flex items-end gap-1.5">
                  <div className="bg-white text-slate-800 p-2.5 rounded-2xl rounded-tl-xs shadow-xs font-normal whitespace-pre-wrap leading-relaxed text-xs">
                    {receivedMessage}
                  </div>
                  <span className="text-[10px] text-slate-600 shrink-0">
                    {timeString}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Outgoing Message (Right Bubble) */}
          <div className="flex justify-end">
            <div className="flex items-end gap-1.5 max-w-[85%]">
              <div className="text-right flex flex-col items-end">
                <span className="text-[9px] text-[#06C755] font-bold">既読</span>
                <span className="text-[10px] text-slate-600">{timeString}</span>
              </div>
              <div className="bg-[#06C755] text-white p-3 rounded-2xl rounded-tr-xs shadow-xs font-normal whitespace-pre-wrap leading-relaxed text-xs">
                {replyText}
              </div>
            </div>
          </div>
        </div>

        {/* Simulated Input Area */}
        <div className="bg-white border-t border-slate-200 p-2.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              copied
                ? 'bg-[#048639] text-white'
                : 'bg-[#06C755] hover:bg-[#05b34c] text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>コピー完了！このままLINEに貼れます</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>この返信文をコピーする</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
