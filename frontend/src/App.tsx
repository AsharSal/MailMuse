import { useState } from 'react'
import './App.css'
import EmailComposer from './components/EmailComposer'
import PromptHistory from './components/PromptHistory'
import AuthForms from './components/AuthForms'
import { useAuth } from './context/AuthContext'

function App() {
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose')
  const { user, logout } = useAuth();

  if (!user) {
    return <AuthForms />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <header className="bg-white shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Smart Email Composer
              </h1>
              <p className="mt-2 text-lg text-indigo-600 font-medium">Generate professional emails with AI assistance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="font-medium text-indigo-700">{user.name}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <nav className="bg-white shadow-md mb-6 sticky top-0 z-10 border-b border-indigo-100">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 py-4">
            <button
              onClick={() => setActiveTab('compose')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'compose'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white text-gray-700 hover:bg-indigo-50 border border-indigo-200'
              }`}
            >
              Compose Email
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white text-gray-700 hover:bg-indigo-50 border border-indigo-200'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'compose' ? <EmailComposer /> : <PromptHistory />}
        </div>
      </main>
    </div>
  )
}

export default App
