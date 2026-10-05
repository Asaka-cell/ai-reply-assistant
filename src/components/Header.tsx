import React from 'react';
import { MessageSquare, History, BookOpen, Sparkles, Smartphone } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenEtiquette: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenEtiquette,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-2xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#06C755] to-[#2bd971] flex items-center justify-center text-white shadow-md shadow-[#06C755]/20">
            <MessageSquare className="w-5 h-5 fill-white stroke-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-base sm:text-lg text-slate-800 tracking-tight flex items-center gap-1">
                LINE返信アシスタント
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#06C755]/10 text-[#048639]">
                AI搭載
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden xs:block">
              丁寧・自然・カジュアルの3パターンを提案 ✨
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenEtiquette}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
            title="返信マナーガイド"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">マナー手帳</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
            title="作成履歴"
          >
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">履歴</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#06C755] text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
