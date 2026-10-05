import React, { useState } from 'react';
import { EmojiPreference, LengthPreference } from '../types';
import { SlidersHorizontal, ChevronDown, ChevronUp, Smile, AlignLeft } from 'lucide-react';

interface OptionsSectionProps {
  emojiPreference: EmojiPreference;
  onEmojiChange: (val: EmojiPreference) => void;
  lengthPreference: LengthPreference;
  onLengthChange: (val: LengthPreference) => void;
}

export const OptionsSection: React.FC<OptionsSectionProps> = ({
  emojiPreference,
  onEmojiChange,
  lengthPreference,
  onLengthChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden transition-all shadow-2xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>こだわり調整（絵文字の量・文の長さ）</span>
          <span className="text-[10px] text-slate-400 font-normal">
            {emojiPreference === 'standard' && lengthPreference === 'standard'
              ? 'おまかせ標準'
              : 'カスタム設定中'}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-3.5 pt-1 border-t border-slate-100 space-y-3 bg-slate-50/50">
          {/* Emoji balance */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              <Smile className="w-3.5 h-3.5 text-amber-500" />
              <span>絵文字・顔文字の量</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'few', label: 'ひかえめ 🍃', desc: '0〜1個' },
                { id: 'standard', label: 'ふつう ✨', desc: '自然な適量' },
                { id: 'many', label: 'たっぷり 💖', desc: '表情豊か' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onEmojiChange(item.id as EmojiPreference)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    emojiPreference === item.id
                      ? 'border-[#06C755] bg-emerald-50 text-[#048639] font-bold shadow-2xs ring-1 ring-[#06C755]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>{item.label}</div>
                  <div className="text-[9px] text-slate-400 font-normal">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Length preference */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              <AlignLeft className="w-3.5 h-3.5 text-blue-500" />
              <span>返信メッセージの長さ</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'short', label: '短め ⚡', desc: '1〜2行でサクッと' },
                { id: 'standard', label: '標準 📝', desc: '一番送りやすい' },
                { id: 'detailed', label: '丁寧め 💌', desc: '気持ちを込めて' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onLengthChange(item.id as LengthPreference)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    lengthPreference === item.id
                      ? 'border-[#06C755] bg-emerald-50 text-[#048639] font-bold shadow-2xs ring-1 ring-[#06C755]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>{item.label}</div>
                  <div className="text-[9px] text-slate-400 font-normal">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
