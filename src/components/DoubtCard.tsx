import { useState } from 'react';
import type { Doubt } from '../types';

interface DoubtCardProps {
  doubt: Doubt;
  onResolve: (id: string, resolution: string) => Promise<void>;
  onMarkAsAsked: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'Pendente',
  resolved: 'Resolvida',
  asked: 'Perguntei',
};

export function DoubtCard({ doubt, onResolve, onMarkAsAsked, onDelete }: DoubtCardProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [resolution, setResolution] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleResolve = async () => {
    if (!resolution.trim()) {
      alert('Digite como você resolveu a dúvida');
      return;
    }
    await onResolve(doubt.id, resolution);
    setIsResolving(false);
    setResolution('');
  };

  const handleDelete = async () => {
    await onDelete(doubt.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <article className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: getPriorityBorderColor(doubt.priority) }}>
      {/* Header */}
      <header className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{doubt.title}</h3>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800">
              {doubt.subject}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-md ${priorityColors[doubt.priority]}`}>
              Prioridade: {doubt.priority === 'high' ? 'Alta' : doubt.priority === 'medium' ? 'Média' : 'Baixa'}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-800">
              {statusLabels[doubt.status]}
            </span>
          </div>
        </div>
      </header>

      {/* Descrição */}
      <section className="mb-4">
        <p className="text-gray-700 mb-2">{doubt.description}</p>
        <p className="text-sm text-gray-500">
          <strong>Fonte:</strong> {doubt.source}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Criada em:</strong> {formatDate(doubt.createdAt)}
        </p>
      </section>

      {/* Resolução (se resolvida) */}
      {doubt.status === 'resolved' && doubt.resolution && (
        <section className="mb-4 p-3 bg-green-50 rounded-md border border-green-200">
          <p className="text-sm font-semibold text-green-800 mb-1">Como foi resolvida:</p>
          <p className="text-sm text-green-700">{doubt.resolution}</p>
          {doubt.resolvedAt && (
            <p className="text-xs text-green-600 mt-1">Resolvida em: {formatDate(doubt.resolvedAt)}</p>
          )}
        </section>
      )}

      {/* Ações */}
      {doubt.status === 'pending' && (
        <footer className="flex flex-wrap gap-2">
          {!isResolving ? (
            <>
              <button
                onClick={() => setIsResolving(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Marcar como Resolvida
              </button>
              <button
                onClick={() => onMarkAsAsked(doubt.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Preciso Perguntar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Deletar
              </button>
            </>
          ) : (
            <div className="w-full">
              <label htmlFor={`resolution-${doubt.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                Como você resolveu essa dúvida?
              </label>
              <textarea
                id={`resolution-${doubt.id}`}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                rows={3}
                placeholder="Ex: Encontrei na documentação oficial que..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleResolve}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => {
                    setIsResolving(false);
                    setResolution('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </footer>
      )}

      {/* Ações para status "asked" */}
      {doubt.status === 'asked' && (
        <footer className="flex gap-2">
          <button
            onClick={() => setIsResolving(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Marcar como Resolvida
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Deletar
          </button>
        </footer>
      )}

      {/* Confirmação de deleção */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h4 className="text-lg font-semibold mb-4">Confirmar exclusão</h4>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar esta dúvida? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function getPriorityBorderColor(priority: string): string {
  switch (priority) {
    case 'high':
      return '#DC2626';
    case 'medium':
      return '#F59E0B';
    case 'low':
      return '#10B981';
    default:
      return '#6B7280';
  }
}
