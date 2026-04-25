import { useState } from 'react'
import RecommendationForm from './components/RecommendationForm'
import ResultsDisplay from './components/ResultsDisplay'

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setResults({
          recommendations: data.recommendations,
          textResponse: data.textResponse
        });
      } else {
        alert('Failed to get predictions. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
      alert('Network error. Ensure backend is running.');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Smart Crop Intelligence</h1>
        <p>AI-Powered Crop Recommendations for Maximized Yields</p>
      </header>
      
      <main>
        {results ? (
          <ResultsDisplay results={results} onReset={handleReset} />
        ) : (
          <RecommendationForm onSubmit={handlePredict} loading={loading} />
        )}
      </main>
    </div>
  )
}

export default App
