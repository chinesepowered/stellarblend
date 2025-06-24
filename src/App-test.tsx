function App() {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
          Tailwind CSS Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Card 1</h2>
            <p className="text-gray-600">This should be styled with Tailwind</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Button
            </button>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-200">
            <h2 className="text-xl font-semibold text-green-900 mb-4">Card 2</h2>
            <p className="text-green-700">Green themed card</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Green Button
            </button>
          </div>
          
          <div className="bg-red-50 p-6 rounded-xl shadow-lg border border-red-200">
            <h2 className="text-xl font-semibold text-red-900 mb-4">Card 3</h2>
            <p className="text-red-700">Red themed card</p>
            <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Red Button
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700">
            If you can see proper colors, spacing, and styling, Tailwind is working! 🎉
          </p>
        </div>
      </div>
    </div>
  )
}

export default App