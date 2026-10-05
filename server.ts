import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.post('/api/generate-reply', async (req, res) => {
  const {
    relationship = '友人',
    receivedMessage = '',
    intent = '',
    emojiPreference = 'standard',
    lengthPreference = 'standard',
  } = req.body;

  if (!receivedMessage.trim() || !intent.trim()) {
    return res.status(400).json({
      error: '相手から届いたメッセージと、伝えたい内容を入力してください。',
    });
  }

  // System instruction and user prompt setup
  const emojiGuide = {
    few: '絵文字・顔文字はごく控えめ（0〜1個程度）にしてください。',
    standard: 'LINEらしく自然で親しみやすい絵文字を適度（1〜3個程度）に使ってください。',
    many: '明るく感情が伝わる絵文字や記号を多めに（3〜5個程度）使ってください。',
  }[emojiPreference as 'few' | 'standard' | 'many'] || '適度に絵文字を使ってください。';

  const lengthGuide = {
    short: '簡潔にサクッと読める短文（1〜3行程度）にしてください。',
    standard: 'LINEで読みやすい標準的な長さ（2〜4行程度）にしてください。',
    detailed: '丁寧で状況や気持ちがしっかり伝わる少し詳しめの文量にしてください。',
  }[lengthPreference as 'short' | 'standard' | 'detailed'] || '標準的な長さにしてください。';

  const prompt = `
あなたはLINEコミュニケーションの達人AIです。
以下のシチュエーションに合わせて、LINEでそのまま送信できる最適な返信文を3パターン作成してください。

【相手との関係性】
${relationship}
（※上司の場合は失礼のない敬語や気配り、部下の場合は威圧感のない優しいフォロー、友人の場合は親密さとテンポ、両親の場合は安心感と素直さ、恋人の場合は愛情や思いやりを意識してください）

【相手から届いたメッセージ】
${receivedMessage}

【自分が返信で伝えたい内容】
${intent}

【条件】
- 絵文字の調整: ${emojiGuide}
- 文量の調整: ${lengthGuide}
- 日本のLINE文化に合わせた自然な改行や言い回しにしてください。
- 以下の3パターンを必ず作成してください：
  1. 「丁寧（polite）」: 礼儀正しく敬意や配慮がしっかり伝わる好印象な返信
  2. 「自然（natural）」: 堅すぎず崩しすぎない、一番バランスが良く送りやすい返信
  3. 「カジュアル（casual）」: 仲の良さや親近感が伝わる、フランクで温かい返信
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'あなたはユーザーのLINE返信文を考えるプロフェッショナルです。関係性に合わせた細やかな言葉遣いや気遣いのプロです。必ず指定されたJSONスキーマに従って返答してください。',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            polite: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: '丁寧パターンの返信文' },
                point: { type: Type.STRING, description: 'この返信のポイント（20〜40文字程度）' },
                stampIdea: { type: Type.STRING, description: '相性の良いLINEスタンプの提案（例: お辞儀するクマのスタンプ）' }
              },
              required: ['text', 'point', 'stampIdea'],
            },
            natural: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: '自然パターンの返信文' },
                point: { type: Type.STRING, description: 'この返信のポイント（20〜40文字程度）' },
                stampIdea: { type: Type.STRING, description: '相性の良いLINEスタンプの提案' }
              },
              required: ['text', 'point', 'stampIdea'],
            },
            casual: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: 'カジュアルパターンの返信文' },
                point: { type: Type.STRING, description: 'この返信のポイント（20〜40文字程度）' },
                stampIdea: { type: Type.STRING, description: '相性の良いLINEスタンプの提案' }
              },
              required: ['text', 'point', 'stampIdea'],
            },
            overallAdvice: {
              type: Type.STRING,
              description: 'この相手やメッセージへの返信に関するワンポイントアドバイス（30〜60文字程度）',
            },
          },
          required: ['polite', 'natural', 'casual', 'overallAdvice'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('AIからの応答が空でした。');
    }

    const data = JSON.parse(text);
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error generating reply:', error);

    // Fallback if API fails or key is missing
    const fallbackData = generateFallbackReplies(relationship, receivedMessage, intent);
    return res.json({
      success: true,
      data: fallbackData,
      isFallback: true,
      notice: 'AIサーバー接続状況により、最適化テンプレートから自動生成しました。',
    });
  }
});

function generateFallbackReplies(relationship: string, received: string, intent: string) {
  if (relationship === '上司') {
    return {
      polite: {
        text: `お疲れ様です。ご連絡いただきありがとうございます！\n\n${intent}の件、承知いたしました。\n引き続きどうぞよろしくお願いいたします。`,
        point: '感謝と確認の意を丁寧に伝え、安心感を与える文面です。',
        stampIdea: '「お辞儀するキャラクター」や「承知いたしました」のスタンプ',
      },
      natural: {
        text: `お疲れ様です！\nメッセージありがとうございます。\n\n${intent}の件、了解いたしました！また何かありましたらすぐ共有いたします。`,
        point: '堅苦しさを少し和らげつつ、迅速な対応姿勢を示します。',
        stampIdea: '「了解です！」と書かれた丁寧めなスタンプ',
      },
      casual: {
        text: `お疲れ様です！\nご確認ありがとうございます。\n\n${intent}の件、進めておきますね！お忙しい中ご連絡ありがとうございました✨`,
        point: '明るく前向きな報告で、やり取りをスムーズにします。',
        stampIdea: '「ありがとうございます！」の敬語スタンプ',
      },
      overallAdvice: '上司へのLINEは用件への対応可否と感謝を冒頭でスッキリ伝えるのが好印象です。',
    };
  } else if (relationship === '恋人') {
    return {
      polite: {
        text: `メッセージありがとう！\n\n${intent}の件、了解だよ〜！\n今日もお疲れ様でした。無理しないでね🍀`,
        point: '優しさと労わりの気持ちをしっかり言葉にした返信です。',
        stampIdea: '「おつかれさま」とハートを持ったスタンプ',
      },
      natural: {
        text: `連絡ありがとうー！✨\n\n${intent}ね、了解だよ！\nまたあとでゆっくり話そうね〜🥰`,
        point: 'テンポよく共感を示し、その後の会話へ繋げる自然な文面です。',
        stampIdea: '笑顔やハイタッチの可愛いスタンプ',
      },
      casual: {
        text: `わーい連絡ありがと！💕\n${intent}了解〜！\n今日も会えるの（話せるの）楽しみにしてるね✨`,
        point: '親密さと嬉しさをストレートに伝える可愛いトーンです。',
        stampIdea: 'ハートやぎゅーっとハグするスタンプ',
      },
      overallAdvice: '恋人へは事務連絡だけでなく「連絡くれて嬉しい気持ち」を少し添えると愛されます。',
    };
  } else if (relationship === '両親') {
    return {
      polite: {
        text: `連絡ありがとう！\n\n${intent}の件、わかったよ。\n身体に気をつけて過ごしてね。また連絡します！`,
        point: '安心感と体調への気遣いを添えた誠実な返信です。',
        stampIdea: '「ありがとう」のほっこり系スタンプ',
      },
      natural: {
        text: `メッセージありがとう〜！\n${intent}ね、了解したよ！🙆‍♀️\nそっちも元気にしてる？また電話するね！`,
        point: '絵文字を交えて元気な様子を伝える親しみやすい文面です。',
        stampIdea: 'OKサインの可愛いスタンプ',
      },
      casual: {
        text: `はーい了解！✨\n${intent}ね！\nいつも気にかけてくれてありがとね〜！`,
        point: '短くパッと返せて、素直な感謝も伝わる文面です。',
        stampIdea: '手を振るキャラクターのスタンプ',
      },
      overallAdvice: '両親へは短文でも「元気だよ」というニュアンスが伝わると安心してもらえます。',
    };
  } else if (relationship === '部下') {
    return {
      polite: {
        text: `ご連絡ありがとうございます。お疲れ様です！\n\n${intent}の件、確認しました。いつも丁寧に対応してくれて助かります。\nよろしくお願いします！`,
        point: '日頃の頑張りを認める一言を添え、心理的安全性を高めます。',
        stampIdea: '「お疲れ様です」や親指を立てるグッドスタンプ',
      },
      natural: {
        text: `お疲れ様！連絡ありがとう〜。\n\n${intent}の件、了解だよ！👍\n何か困ったことがあったらいつでも言ってね！`,
        point: '相談しやすい柔らかいトーンで、頼れる先輩・上司感を演出します。',
        stampIdea: '「OK！」「よろしくね」のスタンプ',
      },
      casual: {
        text: `お疲れー！ありがとう！✨\n${intent}了解！バッチリです🙆‍♂️\n今日も無理しすぎずいこうね〜！`,
        point: 'ポジティブな声かけでモチベーションを高めるフレンドリーな返信です。',
        stampIdea: 'ガッツポーズやファイトのスタンプ',
      },
      overallAdvice: '部下への返信は「受領の確認＋肯定的な一言」を添えると信頼関係が深まります。',
    };
  } else {
    // 友人
    return {
      polite: {
        text: `連絡ありがとう〜！\n\n${intent}の件、了解だよ！\n忙しいのに声かけてくれて嬉しかった！また近々ね✨`,
        point: '丁寧さと気遣いを残しつつ、友達としての温かさを伝えます。',
        stampIdea: '「ありがとう！」の可愛い笑顔スタンプ',
      },
      natural: {
        text: `連絡ありがとうー！😆\n\n${intent}ね、オッケーだよ！\nまた都合いい時に合わせよう〜！楽しみにしてるね🙌`,
        point: 'テンポがよく、会話が弾みやすい王道フレンドリートーンです。',
        stampIdea: '「りょ！」「OK」などの親しみやすいスタンプ',
      },
      casual: {
        text: `ありがとー！✨\n${intent}了解🙆‍♀️\n早く会いたい〜！また連絡してねー！`,
        point: '仲良しだからこそ送れる、サクッと気持ちが伝わるラフな文章です。',
        stampIdea: 'キラキラやハイテンションなスタンプ',
      },
      overallAdvice: '友人へのLINEはリアクションの早さと共感の絵文字を1つ入れると心地よいです。',
    };
  }
}

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
