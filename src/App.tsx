import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RelationshipSelector } from './components/RelationshipSelector';
import { InputSection } from './components/InputSection';
import { OptionsSection } from './components/OptionsSection';
import { ReplyCard } from './components/ReplyCard';
import { ChatSimulatorModal } from './components/ChatSimulatorModal';
import { HistoryModal } from './components/HistoryModal';
import { EtiquetteModal } from './components/EtiquetteModal';
import {
  RelationshipType,
  EmojiPreference,
  LengthPreference,
  GenerationResult,
  HistoryItem,
} from './types';
import { Sparkles, Send, RefreshCw, AlertCircle, CheckCircle, Lightbulb, MessageSquare } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'line_reply_history_v1';

export default function App() {
  const [relationship, setRelationship] = useState<RelationshipType>('上司');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [intent, setIntent] = useState('');
  const [emojiPreference, setEmojiPreference] = useState<EmojiPreference>('standard');
  const [lengthPreference, setLengthPreference] = useState<LengthPreference>('standard');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);

  // Modals & previews
  const [previewReplyText, setPreviewReplyText] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEtiquetteOpen, setIsEtiquetteOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleApplyPreset = (received: string, userIntent: string) => {
    setReceivedMessage(received);
    setIntent(userIntent);
    setError(null);
    showToast('例文をセットしました！✨');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!receivedMessage.trim()) {
      setError('「相手から届いたメッセージ」を入力してください。');
      return;
    }
    if (!intent.trim()) {
      setError('「自分が返信で伝えたい内容」を入力してください。');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationship,
          receivedMessage: receivedMessage.trim(),
          intent: intent.trim(),
          emojiPreference,
          lengthPreference,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '返信文の作成に失敗しました。');
      }

      const generated: GenerationResult = data.data;
      setResult(generated);

      // Save to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        relationship,
        receivedMessage: receivedMessage.trim(),
        intent: intent.trim(),
        result: generated,
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (e) {
        console.error(e);
      }

      showToast('3パターンの返信文が完成しました！🎉');

      // Scroll smoothly to results
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '通信エラーが発生しました。再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('これまでの作成履歴をすべて削除しますか？')) {
      setHistory([]);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
      showToast('履歴を削除しました。');
    }
  };

  const handleRestoreFromHistory = (item: HistoryItem) => {
    setRelationship(item.relationship);
    setReceivedMessage(item.receivedMessage);
    setIntent(item.intent);
    setResult(item.result);
    showToast('履歴から復元しました！✨');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 border border-slate-700">
          <CheckCircle className="w-4 h-4 text-[#06C755]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenEtiquette={() => setIsEtiquetteOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3.5 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-[#06C755] to-[#048639] text-white p-4.5 sm:p-6 shadow-md shadow-emerald-500/15">
          <div className="relative z-10 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold text-white tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>返信に悩む時間をゼロに！</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black leading-snug">
              LINEの返信、もう迷わない ✨
            </h2>
            <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed max-w-lg">
              相手との関係性を選ぶだけで、AIが「丁寧」「自然」「カジュアル」の3通りを作成。ワンタップでコピーしてLINEに貼り付けられます。
            </p>
          </div>

          {/* Decorative cute circles */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute right-12 top-2 text-5xl opacity-20 pointer-events-none select-none">
            💬
          </div>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-4 sm:p-5 space-y-5"
        >
          {/* 1. Relationship selector */}
          <RelationshipSelector
            selected={relationship}
            onChange={(rel) => {
              setRelationship(rel);
              setError(null);
            }}
          />

          <hr className="border-slate-100" />

          {/* 2 & 3. Inputs */}
          <InputSection
            relationship={relationship}
            receivedMessage={receivedMessage}
            onReceivedMessageChange={(val) => {
              setReceivedMessage(val);
              if (error) setError(null);
            }}
            intent={intent}
            onIntentChange={(val) => {
              setIntent(val);
              if (error) setError(null);
            }}
            onApplyPreset={handleApplyPreset}
          />

          {/* Additional Options */}
          <OptionsSection
            emojiPreference={emojiPreference}
            onEmojiChange={setEmojiPreference}
            lengthPreference={lengthPreference}
            onLengthChange={setLengthPreference}
          />

          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="font-semibold">{error}</div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
              isLoading
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#06C755] to-[#048639] hover:from-[#05b34c] hover:to-[#037030] shadow-emerald-500/25'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>相手の気持ちを考えて返信文を作成中... ✨</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-white text-white" />
                <span>3パターンの返信文をAI作成する</span>
                <Send className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Results Section */}
        {result && (
          <div id="results-section" className="space-y-4 pt-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#06C755]" />
                <h3 className="font-black text-base sm:text-lg text-slate-800">
                  AI提案の返信パターン
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                お好きな文章をコピーできます
              </span>
            </div>

            {/* Overall Advice banner */}
            {result.overallAdvice && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-900">返信ワンポイントアドバイス</span>
                  <p className="text-amber-800 leading-relaxed">
                    {result.overallAdvice}
                  </p>
                </div>
              </div>
            )}

            {/* The 3 Cards: 丁寧 / 自然 / カジュアル */}
            <div className="space-y-3.5">
              <ReplyCard
                type="polite"
                pattern={result.polite}
                onPreview={(text) => setPreviewReplyText(text)}
                onCopySuccess={() => showToast('「丁寧」な返信文をコピーしました！📋✨')}
              />

              <ReplyCard
                type="natural"
                pattern={result.natural}
                onPreview={(text) => setPreviewReplyText(text)}
                onCopySuccess={() => showToast('「自然」な返信文をコピーしました！📋✨')}
              />

              <ReplyCard
                type="casual"
                pattern={result.casual}
                onPreview={(text) => setPreviewReplyText(text)}
                onCopySuccess={() => showToast('「カジュアル」な返信文をコピーしました！📋✨')}
              />
            </div>

            {/* Re-generate helper */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 shadow-2xs transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>別の言い回しを再生成する</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto text-center text-xs text-slate-400 py-6 border-t border-slate-200/60 max-w-2xl mx-auto w-full px-4">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <MessageSquare className="w-3.5 h-3.5 text-[#06C755]" />
          <span>LINE返信アシスタント</span>
          <span>•</span>
          <span>スマホ対応AI返信ジェネレーター</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          ※個人情報や機密情報は伏せて入力することをおすすめします。
        </p>
      </footer>

      {/* Chat Simulator Modal */}
      {previewReplyText && (
        <ChatSimulatorModal
          isOpen={!!previewReplyText}
          onClose={() => setPreviewReplyText(null)}
          relationship={relationship}
          receivedMessage={receivedMessage}
          replyText={previewReplyText}
        />
      )}

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onRestore={handleRestoreFromHistory}
      />

      {/* Etiquette Guide Modal */}
      <EtiquetteModal
        isOpen={isEtiquetteOpen}
        onClose={() => setIsEtiquetteOpen(false)}
      />
    </div>
  );
}
