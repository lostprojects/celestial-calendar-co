export interface Interpretation {
  id: string;
  birth_chart_id: string;
  user_id: string;
  content: string;
  version: number;
  previous_version_id: string | null;
  created_at: string;
}

export type InterpretationInsert = Omit<Interpretation, 'id' | 'created_at'>;
