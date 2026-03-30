import { useState, useEffect, useCallback } from 'react';
import type { Doubt, CreateDoubtData } from '../types';
import { doubtsService } from '../services/api';

interface UseDoubtsReturn {
  doubts: Doubt[];
  loading: boolean;
  error: string | null;
  createDoubt: (data: CreateDoubtData) => Promise<void>;
  updateDoubt: (id: string, resolution: string) => Promise<void>;
  deleteDoubt: (id: string) => Promise<void>;
  markAsAsked: (id: string) => Promise<void>;
  refreshDoubts: () => Promise<void>;
}

export function useDoubts(): UseDoubtsReturn {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dúvidas da API
  const fetchDoubts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doubtsService.getAll();
      setDoubts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar nova dúvida
  const createDoubt = useCallback(async (data: CreateDoubtData) => {
    try {
      const newDoubt = await doubtsService.create(data);
      setDoubts((prev) => [newDoubt, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar dúvida');
      throw err;
    }
  }, []);

  // Atualizar dúvida (marcar como resolvida)
  const updateDoubt = useCallback(async (id: string, resolution: string) => {
    try {
      const updated = await doubtsService.markAsResolved(id, resolution);
      setDoubts((prev) =>
        prev.map((doubt) => (doubt.id === id ? updated : doubt))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar dúvida');
      throw err;
    }
  }, []);

  // Marcar como "preciso perguntar"
  const markAsAsked = useCallback(async (id: string) => {
    try {
      const updated = await doubtsService.markAsAsked(id);
      setDoubts((prev) =>
        prev.map((doubt) => (doubt.id === id ? updated : doubt))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar dúvida');
      throw err;
    }
  }, []);

  // Deletar dúvida
  const deleteDoubt = useCallback(async (id: string) => {
    try {
      await doubtsService.delete(id);
      setDoubts((prev) => prev.filter((doubt) => doubt.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar dúvida');
      throw err;
    }
  }, []);

  // Carregar dúvidas ao montar o componente
  useEffect(() => {
    fetchDoubts();
  }, [fetchDoubts]);

  return {
    doubts,
    loading,
    error,
    createDoubt,
    updateDoubt,
    deleteDoubt,
    markAsAsked,
    refreshDoubts: fetchDoubts,
  };
}
