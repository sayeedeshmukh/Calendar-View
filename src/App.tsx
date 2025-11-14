import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Tailwind v4 is Working! 🎉
        </h1>
        <p className="text-gray-600">
          Your setup with Tailwind v4 is now configured correctly.
        </p>
        <button className="mt-4 bg-white-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;