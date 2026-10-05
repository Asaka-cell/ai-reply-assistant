import React, { useState } from 'react';
import { ReplyPattern } from '../types';
import { Copy, Check, Share2, Sparkles, Smartphone, Edit3, MessageCircle } from 'lucide-react';

interface ReplyCardProps {
  type: 'polite' | 'natural' | 'casual';
  pattern: ReplyPattern;
  onPreview: (text: string) => void;
  onCopySuccess: () => void;
}

const TYPE_CONFIGS = {
  polite: {
    title: '丁寧',
    sub: '敬意・マナー重視',
    emoji: '🎀',
    accentColor: 'border-blue-200 bg-blue-50/40 text-blue-900',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    bubbleColor: 'bg-white border-blue-100',
    tag: '目上の方・丁寧にいきたい時',
  },
  natural: {
    title: '自然',
    sub: '親しみ・バランス',
    emoji: '🌿',
    accentColor: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
    badgeColor: 'bg-[#06C755]/15 text-[#048639] border-emerald-200',
    bubbleColor: 'bg-white border-emerald-100',
    tag: '一番使いやすいおすすめ定番',
  },
  casual: {
    title: 'カジュアル',
    sub: 'フランク・気楽',
    emoji: '🎈',
    accentColor: 'border-amber-200 bg-amber-50/40 text-amber-900',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    bubbleColor: 'bg-white border-amber-100',
    tag: '仲の良い相手・テンポよく返したい時',
  },
};

export const ReplyCard: React.FC<ReplyCardProps> = ({
  type,
  pattern,
  onPreview,
  onCopySuccess,
}) => {
  const config = TYPE_CONFIGS[type];
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(pattern.text);

  // Sync if pattern prop changes
  React.useEffect(() => {
    setEditedText(pattern.text);
  }, [pattern.text]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(editedText);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = editedText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleOpenLine = () => {
    // LINE scheme URL to open LINE with the text pre-filled
    const encoded = encodeURIComponent(editedText);
    const lineUrl = `https://line.me/R/msg/text/?${encoded}`;
    window.open(lineUrl, '_blank');
  };

  return (
    <div
      className={`rounded-2xl border ${config.accentColor} p-3.5 sm:p-4.5 bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{config.emoji}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-base sm:text-lg text-slate-800">
                  {config.title}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.badgeColor}`}
                >
                  {config.sub}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{config.tag}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                isEditing
                  ? 'bg-slate-200 text-slate-800'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="文章を少し手直しする"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onPreview(editedText)}
              className="p-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="LINE画面でプレビューする"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message bubble preview */}
        <div className="relative mb-3">
          {isEditing ? (
            <div className="space-y-1">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-2xl border-2 border-[#06C755] bg-emerald-50/20 text-slate-800 text-sm focus:outline-none font-sans leading-relaxed resize-y"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
                <span>編集モード（自由に言い回しを微調整できます）</span>
                <span>{editedText.length}文字</span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="p-3.5 rounded-2xl bg-[#f0f9f3] border border-emerald-100 text-slate-800 text-sm font-medium leading-relaxed whitespace-pre-wrap cursor-pointer hover:bg-[#e7f7ec] transition-colors relative group"
            >
              {editedText}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-500 text-[10px] px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-0.5">
                <Edit3 className="w-2.5 h-2.5" />
                タップで編集
              </div>
            </div>
          )}
        </div>

        {/* Advice Point & Stamp recommendation */}
        <div className="space-y-1.5 mb-3.5">
          {pattern.point && (
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 flex items-start gap-1.5">
              <span className="text-[11px] font-bold text-emerald-600 shrink-0 mt-0.2">
                💡 ポイント:
              </span>
              <span className="text-[11px] leading-tight">{pattern.point}</span>
            </div>
          )}

          {pattern.stampIdea && (
            <div className="text-[11px] text-slate-500 bg-amber-50/60 border border-amber-100/70 rounded-xl px-2.5 py-1 flex items-center gap-1.5">
              <span className="text-amber-600 font-semibold shrink-0">🐾 おすすめスタンプ:</span>
              <span className="truncate">{pattern.stampIdea}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-100">
        {/* Copy Button (Primary) */}
        <button
          type="button"
          onClick={handleCopy}
          className={`col-span-3 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 ${
            copied
              ? 'bg-[#048639] text-white ring-2 ring-emerald-300'
              : 'bg-[#06C755] hover:bg-[#05b34c] text-white shadow-emerald-500/20'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>コピー完了！✨</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>本文をコピー</span>
            </>
          )}
        </button>

        {/* Preview in LINE chat UI */}
        <button
          type="button"
          onClick={() => onPreview(editedText)}
          className="col-span-1 py-2.5 px-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 transition-all"
          title="スマホ画面プレビュー"
        >
          <Smartphone className="w-4 h-4 text-slate-500" />
          <span className="text-[10px] sm:text-xs">見本</span>
        </button>

        {/* LINE URL open */}
        <button
          type="button"
          onClick={handleOpenLine}
          className="col-span-1 py-2.5 px-2 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-[#048639] border border-emerald-200 flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 transition-all"
          title="LINEアプリで送る"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs">LINE</span>
        </button>
      </div>
    </div>
  );
};
