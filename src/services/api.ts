import type { Doubt, Subject, CreateDoubtData, UpdateDoubtData, CreateSubjectData } from '../types';

// Usa variável do Vercel (produção) ou localhost (desenvolvimento)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ==================== DOUBTS ====================

export const doubtsService = {
  // GET /doubts - Listar todas as dúvidas
  async getAll(): Promise<Doubt[]> {
    const response = await fetch(`${API_URL}/doubts`);
    if (!response.ok) throw new Error('Falha ao buscar dúvidas');
    return response.json();
  },

  // POST /doubts - Criar nova dúvida
  async create(data: CreateDoubtData): Promise<Doubt> {
    const newDoubt = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      resolution: null,
    };

    const response = await fetch(`${API_URL}/doubts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoubt),
    });

    if (!response.ok) throw new Error('Falha ao criar dúvida');
    return response.json();
  },

  // PATCH /doubts/:id - Atualizar dúvida
  async update(id: string, data: UpdateDoubtData): Promise<Doubt> {
    const response = await fetch(`${API_URL}/doubts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Falha ao atualizar dúvida');
    return response.json();
  },

  // DELETE /doubts/:id - Deletar dúvida
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/doubts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Falha ao deletar dúvida');
  },

  // Helper: Marcar dúvida como resolvida
  async markAsResolved(id: string, resolution: string): Promise<Doubt> {
    return this.update(id, {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
      resolution,
    });
  },

  // Helper: Marcar dúvida como "preciso perguntar"
  async markAsAsked(id: string): Promise<Doubt> {
    return this.update(id, {
      status: 'asked',
    });
  },
};

// ==================== SUBJECTS ====================

export const subjectsService = {
  // GET /subjects - Listar todas as matérias
  async getAll(): Promise<Subject[]> {
    const response = await fetch(`${API_URL}/subjects`);
    if (!response.ok) throw new Error('Falha ao buscar matérias');
    return response.json();
  },

  // POST /subjects - Criar nova matéria
  async create(data: CreateSubjectData): Promise<Subject> {
    const newSubject = {
      ...data,
      id: crypto.randomUUID(),
    };

    const response = await fetch(`${API_URL}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubject),
    });

    if (!response.ok) throw new Error('Falha ao criar matéria');
    return response.json();
  },
};