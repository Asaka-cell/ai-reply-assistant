import React from 'react';
import { HistoryItem } from '../types';
import { X, Trash2, Copy, Check, Clock, ArrowRight } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onRestore: (item: HistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRestore,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyText = async (id: string, text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm">作成履歴</h3>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {history.length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                履歴全消去
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p>作成した返信文の履歴はここに保存されます。</p>
            </div>
          ) : (
            history.map((item) => {
              const date = new Date(item.timestamp);
              const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date
                .getHours()
                .toString()
                .padStart(2, '0')}:${date
                .getMinutes()
                .toString()
                .padStart(2, '0')}`;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#048639]">
                      【{item.relationship}】宛て
                    </span>
                    <span className="text-slate-400">{dateStr}</span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">
                    <p className="line-clamp-1">
                      <span className="text-slate-400 font-medium">届いた文: </span>
                      {item.receivedMessage}
                    </p>
                    <p className="line-clamp-1">
                      <span className="text-slate-400 font-medium">伝えたい事: </span>
                      {item.intent}
                    </p>
                  </div>

                  {/* 3 patterns quick copy */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {(['polite', 'natural', 'casual'] as const).map((key) => {
                      const labels = {
                        polite: '丁寧',
                        natural: '自然',
                        casual: 'カジュアル',
                      };
                      const pat = item.result[key];
                      const copyKey = `${item.id}-${key}`;
                      const isCopied = copiedId === copyKey;

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleCopyText(copyKey, pat.text)}
                          className={`p-1.5 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-1 transition-all ${
                            isCopied
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>済</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>{labels[key]}</span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Restore button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onRestore(item);
                        onClose();
                      }}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
                    >
                      <span>この内容を入力欄に戻す</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
