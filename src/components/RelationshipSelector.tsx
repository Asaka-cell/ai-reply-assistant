import React from 'react';
import { RELATIONSHIPS } from '../constants/presets';
import { RelationshipType } from '../types';
import { Check } from 'lucide-react';

interface RelationshipSelectorProps {
  selected: RelationshipType;
  onChange: (relation: RelationshipType) => void;
}

export const RelationshipSelector: React.FC<RelationshipSelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-[#06C755] text-white flex items-center justify-center text-xs font-black shadow-xs">
            1
          </span>
          <span>相手との関係</span>
          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
            必須
          </span>
        </label>
        <span className="text-[11px] text-slate-400 font-medium">
          関係性に合わせて言葉遣いを調整
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {RELATIONSHIPS.map((rel) => {
          const isSelected = selected === rel.id;
          return (
            <button
              key={rel.id}
              type="button"
              onClick={() => onChange(rel.id)}
              className={`relative flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'border-[#06C755] bg-emerald-50/70 shadow-sm shadow-[#06C755]/15 ring-2 ring-[#06C755]/20'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              {/* Checkmark icon for selected */}
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#06C755] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}

              {/* Emoji avatar */}
              <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow-xs transition-transform duration-200 group-hover:scale-110">
                {rel.emoji}
              </span>

              {/* Label */}
              <span
                className={`text-xs sm:text-sm font-bold tracking-tight ${
                  isSelected ? 'text-[#048639]' : 'text-slate-700'
                }`}
              >
                {rel.id}
              </span>

              {/* Mini badge */}
              <span
                className={`text-[9px] sm:text-[10px] leading-tight font-medium mt-0.5 truncate max-w-full px-1 py-0.2 rounded ${
                  isSelected
                    ? 'bg-[#06C755]/15 text-[#048639] font-bold'
                    : 'text-slate-400'
                }`}
              >
                {rel.badge.split('・')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Relationship Hint */}
      {(() => {
        const current = RELATIONSHIPS.find((r) => r.id === selected);
        if (!current) return null;
        return (
          <div className="bg-white/80 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{current.emoji}</span>
              <span className="font-bold text-slate-700">【{current.title}】宛て:</span>
              <span className="text-slate-500 hidden sm:inline">{current.description}</span>
            </div>
            <span className="text-[11px] font-semibold text-[#048639] bg-emerald-50 px-2 py-0.5 rounded-full">
              {current.badge}
            </span>
          </div>
        );
      })()}
    </div>
  );
};
