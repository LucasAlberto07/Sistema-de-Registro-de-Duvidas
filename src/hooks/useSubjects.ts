import { useState, useEffect, useCallback } from 'react';
import type { Subject, CreateSubjectData } from '../types';
import { subjectsService } from '../services/api';

interface UseSubjectsReturn {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  createSubject: (data: CreateSubjectData) => Promise<void>;
  refreshSubjects: () => Promise<void>;
}

export function useSubjects(): UseSubjectsReturn {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar matérias da API
  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subjectsService.getAll();
      setSubjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar nova matéria
  const createSubject = useCallback(async (data: CreateSubjectData) => {
    try {
      const newSubject = await subjectsService.create(data);
      setSubjects((prev) => [...prev, newSubject]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar matéria');
      throw err;
    }
  }, []);

  // Carregar matérias ao montar o componente
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    loading,
    error,
    createSubject,
    refreshSubjects: fetchSubjects,
  };
}
