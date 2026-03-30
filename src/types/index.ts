// Types para as entidades da API

export type DoubtStatus = 'pending' | 'resolved' | 'asked';
export type DoubtPriority = 'low' | 'medium' | 'high';

export interface Doubt {
  id: string;
  title: string;
  description: string;
  subject: string;
  status: DoubtStatus;
  priority: DoubtPriority;
  source: string;
  createdAt: string;
  resolvedAt: string | null;
  resolution: string | null;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

// Type para criação de nova dúvida (sem id, createdAt, resolvedAt, resolution)
export type CreateDoubtData = Omit<Doubt, 'id' | 'createdAt' | 'resolvedAt' | 'resolution'>;

// Type para atualização de dúvida (campos opcionais)
export type UpdateDoubtData = Partial<Omit<Doubt, 'id' | 'createdAt'>>;

// Type para criação de matéria
export type CreateSubjectData = Omit<Subject, 'id'>;
