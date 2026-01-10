export interface UrpaArtifact {
  id: string;
  artifact_type: 'code' | 'document' | 'image' | 'file';
  title: string;
  content?: string;
  language?: string;
  created_at: string;
  savedToDropbox?: boolean;
}

export interface AITask {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  time: string;
}

