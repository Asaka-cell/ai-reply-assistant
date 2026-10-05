export type RelationshipType = '上司' | '部下' | '友人' | '両親' | '恋人';

export type EmojiPreference = 'few' | 'standard' | 'many';
export type LengthPreference = 'short' | 'standard' | 'detailed';

export interface ReplyPattern {
  text: string;
  point: string;
  stampIdea: string;
}

export interface GenerationResult {
  polite: ReplyPattern;
  natural: ReplyPattern;
  casual: ReplyPattern;
  overallAdvice: string;
}

export interface PresetItem {
  id: string;
  relationship: RelationshipType;
  label: string;
  receivedMessage: string;
  intent: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  relationship: RelationshipType;
  receivedMessage: string;
  intent: string;
  result: GenerationResult;
}
