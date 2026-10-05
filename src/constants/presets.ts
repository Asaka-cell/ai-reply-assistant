import { PresetItem, RelationshipType } from '../types';

export interface RelationshipConfig {
  id: RelationshipType;
  title: string;
  badge: string;
  emoji: string;
  avatarBg: string;
  borderColor: string;
  description: string;
  sampleSender: string;
}

export const RELATIONSHIPS: RelationshipConfig[] = [
  {
    id: '上司',
    title: '上司・先輩',
    badge: '敬語・マナー重視',
    emoji: '👔',
    avatarBg: 'bg-blue-100 text-blue-700',
    borderColor: 'border-blue-400',
    description: '礼儀と迅速な報告、失礼のない気配り表現',
    sampleSender: '部長 / 先輩',
  },
  {
    id: '部下',
    title: '部下・後輩',
    badge: '優しいフォロー',
    emoji: '💼',
    avatarBg: 'bg-emerald-100 text-emerald-700',
    borderColor: 'border-emerald-400',
    description: '威圧感を与えず、安心感とやる気を引き出す表現',
    sampleSender: '後輩 / メンバー',
  },
  {
    id: '友人',
    title: '友人・仲間',
    badge: 'フランク・テンポ良し',
    emoji: '☕',
    avatarBg: 'bg-amber-100 text-amber-700',
    borderColor: 'border-amber-400',
    description: '親密さ・共感・ノリを大切にした自然な表現',
    sampleSender: '友達',
  },
  {
    id: '両親',
    title: '両親・家族',
    badge: '安心感・素直さ',
    emoji: '🏡',
    avatarBg: 'bg-purple-100 text-purple-700',
    borderColor: 'border-purple-400',
    description: '近況の安心感や感謝、素直で温かい表現',
    sampleSender: 'お母さん / お父さん',
  },
  {
    id: '恋人',
    title: '恋人・パートナー',
    badge: '愛情・思いやり',
    emoji: '💕',
    avatarBg: 'bg-rose-100 text-rose-700',
    borderColor: 'border-rose-400',
    description: 'やさしさ・愛情・甘えや楽しさを添えた表現',
    sampleSender: '恋人',
  },
];

export const PRESETS: PresetItem[] = [
  {
    id: 'boss-mtg',
    relationship: '上司',
    label: '📅 日程調整・確認',
    receivedMessage: 'お疲れ様です。来週の定例ミーティングですが、火曜の14時か水曜の11時で都合はいかがでしょうか？',
    intent: '火曜の14時は先約があるので、水曜の11時でお願いしたい。資料は月曜までに共有予定。',
  },
  {
    id: 'boss-drink',
    relationship: '上司',
    label: '🍶 飲み会のやんわりお断り',
    receivedMessage: 'お疲れ様！今日仕事終わりにみんなで軽くご飯行くことになったんだけど、もし予定空いてたらどう？',
    intent: '誘ってくれたお礼を伝えつつ、今日は先約（家庭の用事）があって行けない。次回ぜひ参加したい。',
  },
  {
    id: 'junior-task',
    relationship: '部下',
    label: '📝 後輩からの進捗報告',
    receivedMessage: 'お疲れ様です！依頼いただいた資料の初稿ができましたのでドライブに格納しました。確認お手すきの際によろしくお願いします！',
    intent: '迅速な対応に感謝。午後確認してフィードバックする旨を伝え、無理しすぎないよう労う。',
  },
  {
    id: 'friend-hangout',
    relationship: '友人',
    label: '🍕 週末のご飯のお誘い',
    receivedMessage: '久しぶりー！来週末あたり都合よかったらご飯かカフェ行かない？行きたいお店見つけたんだよね！',
    intent: '誘ってくれて嬉しい！土曜の昼なら空いてる。お店のURL教えてほしい。',
  },
  {
    id: 'friend-late',
    relationship: '友人',
    label: '⏰ 待ち合わせ遅刻の連絡',
    receivedMessage: '今駅に着いたよー！南改札の前のカフェあたりにいるね！',
    intent: '電車が少し遅れていて、あと15分くらいで着く予定。本当に申し訳ない、先にお茶しててほしい。',
  },
  {
    id: 'parent-check',
    relationship: '両親',
    label: '📦 荷物送ったよの連絡',
    receivedMessage: '野菜とお米を段ボールで送ったから明日届くと思うよ。仕事忙しそうだけどご飯ちゃんと食べてる？風邪ひかないようにね。',
    intent: 'いつも送ってくれて本当に助かる、ありがとう。元気にやっていること、届いたらまた連絡することを伝える。',
  },
  {
    id: 'lover-date',
    relationship: '恋人',
    label: '✨ 今日のデートお礼',
    receivedMessage: '今日はいっぱい歩いて楽しかったね！無事に家着いた？ゆっくり休んでね🥰',
    intent: '無事に着いた報告。一緒に過ごせてすごく幸せだったこと、またすぐ会いたいことを伝える。',
  },
];

export const QUICK_INTENT_CHIPS: { label: string; text: string }[] = [
  { label: '🙆 了解・OK', text: '承知しました！問題ありません。' },
  { label: '🙏 やんわり断る', text: 'あいにく都合がつかず、今回は見送らせてください。また誘ってください！' },
  { label: '🗓️ 別日程を提案', text: 'その日は先約があるため、別の日（〇日など）はいかがでしょうか？' },
  { label: '✨ 感謝を伝える', text: 'お気遣いいただき本当にありがとうございます！とても助かります。' },
  { label: '🏃‍♂️ 少し遅れそう', text: '移動に少し時間がかかっており、15分ほど遅れそうです。申し訳ありません！' },
  { label: '🍵 体調を気遣う', text: 'お忙しい時期かと思いますので、どうぞご無理なさらないでくださいね。' },
];
