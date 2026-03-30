import { useState, useMemo } from 'react';
import { useDoubts } from './hooks/useDoubts';
import { useSubjects } from './hooks/useSubjects';
import { DoubtFilters } from './components/DoubtFilters';
import { DoubtCard } from './components/DoubtCard';
import { CreateDoubtForm } from './components/CreateDoubtForm';
import type { DoubtStatus } from './types';

function App() {
  const { doubts, loading, error, createDoubt, updateDoubt, deleteDoubt, markAsAsked } = useDoubts();
  const { subjects, loading: subjectsLoading } = useSubjects();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<DoubtStatus | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // useMemo para filtrar dúvidas (evita recalcular a cada render)
  const filteredDoubts = useMemo(() => {
    return doubts.filter((doubt) => {
      const matchesStatus = selectedStatus === 'all' || doubt.status === selectedStatus;
      const matchesSubject = selectedSubject === 'all' || doubt.subject === selectedSubject;
      return matchesStatus && matchesSubject;
    });
  }, [doubts, selectedStatus, selectedSubject]);

  // Loading state
  if (loading || subjectsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dúvidas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Erro ao carregar</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-sm text-red-600">
            Certifique-se que o json-server está rodando na porta 3001
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DevDoubt Tracker</h1>
              <p className="text-gray-600 mt-1">Organize suas dúvidas de estudo</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              + Nova Dúvida
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros e Estatísticas */}
        <DoubtFilters
          doubts={doubts}
          selectedStatus={selectedStatus}
          selectedSubject={selectedSubject}
          onStatusChange={setSelectedStatus}
          onSubjectChange={setSelectedSubject}
        />

        {/* Lista de Dúvidas */}
        {filteredDoubts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedStatus === 'all' && selectedSubject === 'all'
                ? 'Nenhuma dúvida cadastrada'
                : 'Nenhuma dúvida encontrada com esses filtros'}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedStatus === 'all' && selectedSubject === 'all'
                ? 'Comece registrando suas primeiras dúvidas de estudo'
                : 'Tente ajustar os filtros para ver mais resultados'}
            </p>
            {selectedStatus === 'all' && selectedSubject === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Adicionar primeira dúvida
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoubts.map((doubt) => (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                onResolve={updateDoubt}
                onMarkAsAsked={markAsAsked}
                onDelete={deleteDoubt}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de Criação */}
      {showCreateForm && (
        <CreateDoubtForm
          subjects={subjects}
          onSubmit={async (data) => {
            await createDoubt(data);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}

export default App;
