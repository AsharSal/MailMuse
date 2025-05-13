import EmailComposer from './components/EmailComposer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Smart Email Composer</h1>
          <p className="mt-1 text-sm text-gray-500">Generate professional emails with AI assistance</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <EmailComposer />
      </main>
    </div>
  )
}

export default App
