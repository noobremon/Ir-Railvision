import React from 'react'
import TestConnection from './components/TestConnection'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Railway Video Surveillance System</h1>
      </header>
      <main className="container mx-auto py-8">
        <TestConnection />
      </main>
    </div>
  )
}

export default App