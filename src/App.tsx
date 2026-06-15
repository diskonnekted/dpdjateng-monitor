import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center font-sans w-full">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-black text-red-600 tracking-tight">DPD PDIP JATENG</h1>
        <p className="text-xl text-neutral-400 font-medium">Command Center & Monitoring Dashboard</p>
        <div className="pt-8">
          <div className="inline-block px-6 py-3 border border-red-800 bg-red-950/30 text-red-400 rounded-lg shadow-xl shadow-red-900/20">
            System Initialized
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
