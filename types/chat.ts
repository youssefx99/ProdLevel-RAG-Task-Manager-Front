export interface ChatRequestDto {
  query: string;
  sessionId?: string; // Optional: pass to continue conversation
}

export interface Source {
  entityType: string;
  entityId: string;
  text: string;
  score: number;
  citation: string;
}

export interface ChatResponseDto {
  answer: string;
  sources: Source[];
  confidence: number;
  sessionId: string;
  metadata: {
    processingTime: number;
    stepsExecuted: string[];
    retrievedDocuments: number;
    queryClassification: string;
    fromCache?: boolean;
    functionCalls?: any[]; // Track function calls executed
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  metadata?: ChatResponseDto['metadata'];
}
