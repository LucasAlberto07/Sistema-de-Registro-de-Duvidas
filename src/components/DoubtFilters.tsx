import { useMemo } from 'react';
import type { Doubt, DoubtStatus } from '../types';

interface DoubtFiltersProps {
  doubts: Doubt[];
  selectedStatus: DoubtStatus | 'all';
  selectedSubject: string;
  onStatusChange: (status: DoubtStatus | 'all') => void;
  onSubjectChange: (subject: string) => void;
}

export function DoubtFilters({
  doubts,
  selectedStatus,
  selectedSubject,
  onStatusChange,
  onSubjectChange,
}: DoubtFiltersProps) {
  // useMemo para calcular estatísticas (evita recalcular a cada render)
  const stats = useMemo(() => {
    const pending = doubts.filter((d) => d.status === 'pending').length;
    const resolved = doubts.filter((d) => d.status === 'resolved').length;
    const asked = doubts.filter((d) => d.status === 'asked').length;
    const total = doubts.length;

    return { pending, resolved, asked, total };
  }, [doubts]);

  // useMemo para extrair matérias únicas
  const subjects = useMemo(() => {
    const uniqueSubjects = new Set(doubts.map((d) => d.subject));
    return Array.from(uniqueSubjects).sort();
  }, [doubts]);

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="text-center p-4 bg-yellow-100 rounded-lg">
          <p className="text-3xl font-bold text-yellow-800">{stats.pending}</p>
          <p className="text-sm text-yellow-700">Pendentes</p>
        </div>
        <div className="text-center p-4 bg-green-100 rounded-lg">
          <p className="text-3xl font-bold text-green-800">{stats.resolved}</p>
          <p className="text-sm text-green-700">Resolvidas</p>
        </div>
        <div className="text-center p-4 bg-blue-100 rounded-lg">
          <p className="text-3xl font-bold text-blue-800">{stats.asked}</p>
          <p className="text-sm text-blue-700">Perguntei</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Filtro por Status */}
        <div>
          <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por status
          </label>
          <select
            id="filter-status"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as DoubtStatus | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas ({stats.total})</option>
            <option value="pending">Pendentes ({stats.pending})</option>
            <option value="resolved">Resolvidas ({stats.resolved})</option>
            <option value="asked">Preciso Perguntar ({stats.asked})</option>
          </select>
        </div>

        {/* Filtro por Matéria */}
        <div>
          <label htmlFor="filter-subject" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por matéria
          </label>
          <select
            id="filter-subject"
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as matérias</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
