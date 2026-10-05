import React from 'react';
import { PRESETS, QUICK_INTENT_CHIPS } from '../constants/presets';
import { RelationshipType } from '../types';
import { X, Sparkles, Plus, ArrowDown, HelpCircle } from 'lucide-react';

interface InputSectionProps {
  relationship: RelationshipType;
  receivedMessage: string;
  onReceivedMessageChange: (val: string) => void;
  intent: string;
  onIntentChange: (val: string) => void;
  onApplyPreset: (received: string, intent: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  relationship,
  receivedMessage,
  onReceivedMessageChange,
  intent,
  onIntentChange,
  onApplyPreset,
}) => {
  // Filter presets matching current relationship, plus popular presets
  const relevantPresets = PRESETS.filter((p) => p.relationship === relationship);

  const handleAppendIntent = (chipText: string) => {
    if (!intent.trim()) {
      onIntentChange(chipText);
    } else {
      onIntentChange(`${intent}、${chipText}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Preset Selector for Current Relationship */}
      <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-2.5 sm:p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] sm:text-xs font-bold text-emerald-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>【{relationship}】によくある例文・シーン（タップで自動入力）</span>
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">お試し用</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {relevantPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset.receivedMessage, preset.intent)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white border border-emerald-200/80 text-emerald-900 shadow-2xs hover:bg-emerald-100/60 active:scale-95 transition-all text-left"
            >
              {preset.label}
            </button>
          ))}
          {/* Other presets if none for relationship */}
          {relevantPresets.length === 0 &&
            PRESETS.slice(0, 3).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset.receivedMessage, preset.intent)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs hover:bg-slate-100 active:scale-95 transition-all"
              >
                {preset.label}
              </button>
            ))}
        </div>
      </div>

      {/* Field 1: 相手から届いたメッセージ */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#06C755] text-white flex items-center justify-center text-xs font-black shadow-xs">
              2
            </span>
            <span>相手から届いたメッセージ</span>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
              必須
            </span>
          </label>
          <div className="flex items-center gap-2">
            {receivedMessage && (
              <button
                type="button"
                onClick={() => onReceivedMessageChange('')}
                className="text-[11px] text-slate-400 hover:text-rose-500 flex items-center gap-0.5 font-medium transition-colors"
              >
                <X className="w-3 h-3" />
                クリア
              </button>
            )}
            <span className="text-[11px] text-slate-400 font-medium">
              {receivedMessage.length}文字
            </span>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={receivedMessage}
            onChange={(e) => onReceivedMessageChange(e.target.value)}
            placeholder={`例: 「今日はお疲れ様！明日のMTG、10時からでも大丈夫？」\n（相手から届いたLINE本文をそのまま貼り付けてもOKです）`}
            rows={3}
            className="w-full px-3.5 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C755]/30 focus:border-[#06C755] shadow-2xs transition-all resize-y"
          />
        </div>
      </div>

      {/* Field 2: 自分が返信で伝えたい内容 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#06C755] text-white flex items-center justify-center text-xs font-black shadow-xs">
              3
            </span>
            <span>自分が返信で伝えたい内容</span>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
              必須
            </span>
          </label>
          <div className="flex items-center gap-2">
            {intent && (
              <button
                type="button"
                onClick={() => onIntentChange('')}
                className="text-[11px] text-slate-400 hover:text-rose-500 flex items-center gap-0.5 font-medium transition-colors"
              >
                <X className="w-3 h-3" />
                クリア
              </button>
            )}
            <span className="text-[11px] text-slate-400 font-medium">
              {intent.length}文字
            </span>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={intent}
            onChange={(e) => onIntentChange(e.target.value)}
            placeholder={`例: 「了解したこと、少し遅れる可能性があること、資料準備しておくこと」\n（箇条書きやざっくりしたメモでもAIが自然な文章にします）`}
            rows={3}
            className="w-full px-3.5 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#06C755]/30 focus:border-[#06C755] shadow-2xs transition-all resize-y"
          />
        </div>

        {/* Quick Chips for appending intentions */}
        <div className="pt-1">
          <div className="text-[11px] text-slate-500 font-medium mb-1.5 flex items-center gap-1">
            <Plus className="w-3 h-3 text-[#06C755]" />
            <span>ワンタップで要件を追加:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_INTENT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAppendIntent(chip.text)}
                className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all active:scale-95 flex items-center gap-1 border border-slate-200/50"
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
