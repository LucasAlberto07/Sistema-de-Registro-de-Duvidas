import { useState, FormEvent } from 'react';
import type { CreateDoubtData, Subject, DoubtPriority } from '../types';

interface CreateDoubtFormProps {
  subjects: Subject[];
  onSubmit: (data: CreateDoubtData) => Promise<void>;
  onCancel: () => void;
}

export function CreateDoubtForm({ subjects, onSubmit, onCancel }: CreateDoubtFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: subjects.length > 0 ? subjects[0].name : '',
    priority: 'medium' as DoubtPriority,
    source: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.source.trim()) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        status: 'pending',
      });

      // Resetar formulário
      setFormData({
        title: '',
        description: '',
        subject: subjects.length > 0 ? subjects[0].name : '',
        priority: 'medium',
        source: '',
      });
    } catch (error) {
      console.error('Erro ao criar dúvida:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nova Dúvida</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título da dúvida *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Como funciona o useEffect?"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição detalhada *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Descreva sua dúvida com detalhes..."
                required
              />
            </div>

            {/* Matéria */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Matéria *
              </label>
              <select
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridade */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Prioridade *
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as DoubtPriority })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="low">Baixa - Posso resolver depois</option>
                <option value="medium">Média - Importante mas não urgente</option>
                <option value="high">Alta - Preciso resolver logo</option>
              </select>
            </div>

            {/* Fonte */}
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                De onde veio a dúvida? *
              </label>
              <input
                type="text"
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Videoaula - React Hooks, AWS Docs - S3"
                required
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Dúvida'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
