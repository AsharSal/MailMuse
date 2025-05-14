import { useState, useEffect } from 'react';
import { getAllPrompts } from '../api/emailApi';

interface Prompt {
  id: number;
  prompt: string;
  tone: string;
  generatedEmail: string;
  createdAt: string;
  template?: {
    name: string;
    structure: string;
  };
}

interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export default function PromptHistory() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, totalPages: 1, limit: 5 });

  const fetchPrompts = async (page: number) => {
    try {
      setLoading(true);
      const response = await getAllPrompts({ page, limit: pagination.limit });
      setPrompts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load prompts history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchPrompts(newPage);
  };

  const handleCopy = async (id: number, email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy to clipboard');
    }
  };

  if (loading) return (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
      <p className="text-red-700">{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-indigo-800 border-b-2 border-indigo-200 pb-2">
        Email Generation History
      </h2>
      <div className="space-y-6">
        {prompts.map((prompt) => (
          <div key={prompt.id} 
               className="bg-white border border-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="font-semibold text-indigo-900">
                {new Date(prompt.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                {prompt.tone}
              </span>
            </div>
            {prompt.template && (
              <div className="text-sm text-indigo-600 mb-3 bg-indigo-50 inline-block px-3 py-1 rounded-lg">
                Template: {prompt.template.name}
              </div>
            )}
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Prompt:</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{prompt.prompt}</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Generated Email:</h3>
                <button
                  onClick={() => handleCopy(prompt.id, prompt.generatedEmail)}
                  className="inline-flex items-center px-4 py-2 border border-indigo-200 shadow-sm text-sm font-medium rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  {copiedId === prompt.id ? (
                    <span className="flex items-center text-green-600">
                      <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy to Clipboard
                    </span>
                  )}
                </button>
              </div>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{prompt.generatedEmail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors duration-200"
          >
            Previous
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-full ${
                  pageNum === pagination.page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}