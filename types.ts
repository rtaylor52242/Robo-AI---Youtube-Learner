
export interface HistoryItem {
  id: string; // YouTube video ID
  title: string;
}

export interface TranscriptItem {
  timestamp: string;
  text: string;
}

export interface VideoData {
  id: string;
  title: string;
  url: string;
  createdAt: any; // Firestore Timestamp
  insights?: string[];
  transcript?: TranscriptItem[];
}
