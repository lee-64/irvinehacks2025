'use client';

import { useState } from 'react';

export default function CompareLocations() {
  const [zip1, setZip1] = useState('');
  const [zip2, setZip2] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    setError(null); // Reset error
    if (!zip1 || !zip2) {
      setError('Please enter both ZIP codes.');
      return;
    }

    try {
      const response = await fetch('/api/compare_zipcodes', {
        method: 'POST',
        body: JSON.stringify({ zip1, zip2 }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch location scores. Please try again.');
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="h-screen p-10">
      <h1 className="text-4xl font-bold text-center text-gray-900">Compare Locations</h1>
      <p className="text-center text-gray-600 mt-4">
        Compare various locations based on metrics like pollution, unemployment, and more.
      </p>
      <div className="mt-10 flex flex-col items-center">
        <input
          type="text"
          value={zip1}
          onChange={(e) => setZip1(e.target.value)}
          placeholder="Enter ZIP Code 1"
          className="border rounded-lg p-2 w-64 mb-4"
        />
        <input
          type="text"
          value={zip2}
          onChange={(e) => setZip2(e.target.value)}
          placeholder="Enter ZIP Code 2"
          className="border rounded-lg p-2 w-64 mb-4"
        />
        <button
          onClick={handleCompare}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow"
        >
          Compare
        </button>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold">Comparison Results</h2>
          <p className="mt-4">ZIP Code {zip1}: {result.zip1Score}/10</p>
          <p className="mt-2">ZIP Code {zip2}: {result.zip2Score}/10</p>
        </div>
      )}
    </div>
  );
}