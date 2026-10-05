import React from 'react';
import { X, BookOpen, Clock, Smile, AlertCircle, Heart, CheckCircle2 } from 'lucide-react';

interface EtiquetteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EtiquetteModal: React.FC<EtiquetteModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const TIPS = [
    {
      target: '👔 上司・目上の人',
      rules: [
        '基本は【24時間以内】、急ぎの連絡は【15分〜1時間以内】のリアクションが理想です。',
        '「了解しました」ではなく「承知いたしました」や「かしこまりました」を使いましょう。',
        'スタンプのみの返信は避け、文章＋スタンプにするか、文章のみで完結させるのが安全です。',
        '夜間（22時以降）や休日の返信は「夜分遅くに失礼いたします」と一言添えると安心です。',
      ],
      emoji: '👔',
      color: 'bg-blue-50 border-blue-100 text-blue-900',
    },
    {
      target: '💼 部下・後輩',
      rules: [
        '冷たく見えないよう、語尾に「！」や柔らかい絵文字（👍や✨）を1つ添えると安心されます。',
        '用件へのOK・NGだけでなく、「対応ありがとう」「助かります」と感謝・労いを足すのがコツ。',
        '長文で説教調にならないよう、注意点は要点を絞って直接話す約束にするのがスマートです。',
      ],
      emoji: '💼',
      color: 'bg-emerald-50 border-emerald-100 text-emerald-900',
    },
    {
      target: '☕ 友人・同僚',
      rules: [
        '長文になりすぎず、2〜3行でテンポよく返すのがLINEらしい心地よさです。',
        '日程調整は「○日か○日の昼空いてる！」と相手が答えやすい選択肢を提示すると好印象。',
        '遅刻しそうな時は理由の前に「何分遅れそうか」を最初に伝えましょう。',
      ],
      emoji: '☕',
      color: 'bg-amber-50 border-amber-100 text-amber-900',
    },
    {
      target: '🏡 両親・家族',
      rules: [
        '短文でも「元気だよ！」「美味しかったよ」と状態が分かると親御さんは安心します。',
        '荷物をもらったら写真付きで「届いたよ、ありがとう！」と送るととても喜ばれます。',
      ],
      emoji: '🏡',
      color: 'bg-purple-50 border-purple-100 text-purple-900',
    },
    {
      target: '💕 恋人・パートナー',
      rules: [
        '返信が遅くなった時は「ごめんね」の後に「連絡くれて嬉しかったよ」を添えると愛されます。',
        '事務的な連絡になりがちな時こそ、可愛いスタンプやお互いへの労いを1つ入れましょう。',
      ],
      emoji: '💕',
      color: 'bg-rose-50 border-rose-100 text-rose-900',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm">LINE返信マナー手帳 💡</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          <p className="text-xs text-slate-500 leading-relaxed">
            相手との関係性によって、喜ばれる返信スピードや言葉選びは異なります。ちょっと迷ったときの参考にどうぞ！
          </p>

          <div className="space-y-3">
            {TIPS.map((tip, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border ${tip.color} space-y-2`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                  <span>{tip.emoji}</span>
                  <span>{tip.target}</span>
                </div>
                <ul className="space-y-1.5">
                  {tip.rules.map((rule, rIdx) => (
                    <li
                      key={rIdx}
                      className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs font-bold bg-[#06C755] text-white hover:bg-[#05b34c]"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
