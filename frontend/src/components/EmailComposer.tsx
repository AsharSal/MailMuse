import React, { useState } from 'react';
import { composeEmail } from '../api/emailApi';
import { useAuth } from '../context/AuthContext';

const tones = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'persuasive', label: 'Persuasive' },
  { id: 'apologetic', label: 'Apologetic' },
  { id: 'concise', label: 'Concise' },
  { id: 'empathetic', label: 'Empathetic' },
  { id: 'cheerful', label: 'Cheerful' },
  { id: 'urgent', label: 'Urgent' },
];

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const EmailComposer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const { user, updateQuota } = useAuth();

  const handleGenerate = async () => {
    if (!prompt || !selectedTone) {
      setError('Please enter your prompt and select a tone.');
      return;
    }

    const usedQuota = user?.usedQuota ?? 0;
    const monthlyQuota = user?.monthlyQuota ?? 0;

    if (usedQuota >= monthlyQuota) {
      setError('Monthly quota exceeded. Please try again next month.');
      return;
    }

    setLoading(true);
    setError('');
    setCopySuccess(false);

    try {
      const response = await composeEmail({
        prompt,
        tone: selectedTone || 'professional',
      });

      setGeneratedEmail(response.data.generatedEmail);
      if (user) {
        updateQuota(usedQuota + 1);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 403) {
        setError('Monthly quota exceeded. Please try again next month.');
      } else {
        setError(apiError.message || 'Failed to generate email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.log('Failed to copy: ', err);
      setError('Failed to copy to clipboard');
    }
  };

  const quotaPercentage = user ? (user.usedQuota / user.monthlyQuota) * 100 : 0;
  const remainingQuota = user ? user.monthlyQuota - user.usedQuota : 0;
  const isQuotaExceeded = user ? user.usedQuota >= user.monthlyQuota : false;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-indigo-100">
      {/* Quota Display */}
      <div className="bg-indigo-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-indigo-700 font-medium">Monthly Email Quota</span>
          <span className="text-indigo-600">{remainingQuota} remaining</span>
        </div>
        <div className="w-full bg-indigo-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${quotaPercentage}%` }}
          ></div>
        </div>
      </div>

      {isQuotaExceeded && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
          <p className="text-sm text-yellow-700">
            Monthly email quota exceeded. Please try again next month when your quota resets.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-indigo-900 mb-2">
            What would you like to write?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Write a follow-up email to a client after our product demo yesterday"
            className="w-full p-4 border border-indigo-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] transition duration-200 ease-in-out placeholder-indigo-300 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200"
            rows={4}
            disabled={isQuotaExceeded}
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-indigo-900 mb-2">
            Select Tone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                disabled={isQuotaExceeded}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  selectedTone === tone.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                } ${
                  isQuotaExceeded ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {tone.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || isQuotaExceeded}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating your email...
            </span>
          ) : (
            'Generate Email'
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {generatedEmail && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-semibold text-indigo-900">Generated Email</label>
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-4 py-2 border border-indigo-200 shadow-sm text-sm font-medium rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {copySuccess ? (
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
            <div className="relative">
              <textarea
                value={generatedEmail}
                readOnly
                className="w-full min-h-[300px] p-6 border border-indigo-200 rounded-xl shadow-sm font-mono text-sm bg-gradient-to-br from-indigo-50 to-purple-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailComposer;